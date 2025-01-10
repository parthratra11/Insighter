import React, { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

//! Needs fixing

class LangflowClient {
  constructor(baseURL, applicationToken) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }

  async post(endpoint, body, headers = {}) {
    headers["Authorization"] = `Bearer ${this.applicationToken}`;
    headers["Content-Type"] = "application/json";
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

  async runFlow(
    flowId,
    langflowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    tweaks = {}
  ) {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}`;
    return this.post(endpoint, {
      input_value: inputValue,
      input_type: inputType,
      output_type: outputType,
      tweaks: tweaks,
    });
  }
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your analytics assistant. How can I help you today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the Langflow client
  const langflowClient = new LangflowClient(
    "https://api.langflow.astra.datastax.com",
    process.env.NEXT_PUBLIC_LANGFLOW_API_TOKEN
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

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await langflowClient.runFlow(
        "d6dc026b-b629-441d-bf94-8ddafc1ac6c1", // flowId
        "6280155c-72f5-4a5e-a1de-1199cea3c176", // langflowId
        input,
        "chat",
        "chat",
        tweaks
      );

      // Extract the response message
      let aiResponse = "I couldn't process your request.";
      if (
        response &&
        response.outputs &&
        response.outputs[0].outputs[0].outputs.message
      ) {
        aiResponse =
          response.outputs[0].outputs[0].outputs.message.message.text;
      }

      // Add AI response to chat
      setMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I apologize, but I encountered an error processing your request.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-gray-900 rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white font-semibold">Analytics Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-200 max-w-[80%] rounded-lg p-3">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about your analytics..."
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className={`${
                  isLoading
                    ? "bg-indigo-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white rounded-lg p-2`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
