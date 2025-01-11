import { NextResponse } from "next/server";

class LangflowClient {
  constructor(baseURL, applicationToken) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }

  async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
    headers["Authorization"] = `Bearer ${this.applicationToken}`;
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(
          `${response.status} ${response.statusText} - ${JSON.stringify(
            responseMessage
          )}`
        );
      }
      return responseMessage;
    } catch (error) {
      console.error("Request Error:", error.message);
      throw error;
    }
  }

  handleStream(streamUrl, onUpdate, onClose, onError) {
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    eventSource.onerror = (event) => {
      console.error("Stream Error:", event);
      onError(event);
      eventSource.close();
    };

    eventSource.addEventListener("close", () => {
      onClose("Stream closed");
      eventSource.close();
    });

    return eventSource;
  }

  async initiateSession(
    flowId,
    langflowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    stream = false,
    tweaks = {}
  ) {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
    return this.post(endpoint, {
      input_value: inputValue,
      input_type: inputType,
      output_type: outputType,
      tweaks: tweaks,
    });
  }

  async runFlow(
    flowIdOrName,
    langflowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    tweaks = {},
    stream = false,
    onUpdate,
    onClose,
    onError
  ) {
    try {
      const initResponse = await this.initiateSession(
        flowIdOrName,
        langflowId,
        inputValue,
        inputType,
        outputType,
        stream,
        tweaks
      );
      console.log("Init Response:", initResponse);
      if (
        stream &&
        initResponse?.outputs?.[0]?.outputs?.[0]?.artifacts?.stream_url
      ) {
        const streamUrl =
          initResponse.outputs[0].outputs[0].artifacts.stream_url;
        console.log(`Streaming from: ${streamUrl}`);
        this.handleStream(streamUrl, onUpdate, onClose, onError);
      }
      return initResponse;
    } catch (error) {
      console.error("Error running flow:", error);
      if (onError) onError("Error initiating session");
      throw error;
    }
  }
}

export async function POST(req) {
  try {
    const {
      inputValue,
      inputType = "chat",
      outputType = "chat",
      stream = false,
    } = await req.json();

    if (!inputValue) {
      return NextResponse.json(
        { error: "inputValue is required." },
        { status: 400 }
      );
    }

    const flowIdOrName = "d6dc026b-b629-441d-bf94-8ddafc1ac6c1";
    const langflowId = "6280155c-72f5-4a5e-a1de-1199cea3c176";
    const applicationToken = process.env.NEXT_PUBLIC_APP_TOKEN;

    const langflowClient = new LangflowClient(
      "https://api.langflow.astra.datastax.com",
      applicationToken
    );

    const tweaks = {
      "ChatInput-ufonD": {},
      "ParseData-nVbw4": {},
      "Prompt-Mbumw": {},
      "SplitText-gcj2y": {},
      "ChatOutput-kKsN3": {},
      "AstraDB-s0C8l": {},
      "OpenAIEmbeddings-QECx2": {},
      "File-kj26O": {},
      "AstraDBToolComponent-6ImZP": {},
      "OpenAIModel-pgFdD": {},
      "MistralModel-sTyFL": {},
    };

    const response = await langflowClient.runFlow(
      flowIdOrName,
      langflowId,
      inputValue,
      inputType,
      outputType,
      tweaks,
      stream,
      (data) => console.log("Received:", data.chunk),
      (message) => console.log("Stream Closed:", message),
      (error) => console.log("Stream Error:", error)
    );

    if (!stream && response?.outputs) {
      const flowOutputs = response.outputs[0];
      const firstComponentOutputs = flowOutputs.outputs[0];
      const output = firstComponentOutputs.outputs.message;

      return NextResponse.json({ message: output.message.text });
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Handler Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
