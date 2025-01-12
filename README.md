# Insighter: Social Media Engagement Analytics

This repository contains the project developed by Team Forbes (Parth Ratra, Pranay Rajvanshi, Rahul Sharma, and Harsh). The goal of this project is to create a basic analytics module using LangFlow and DataStax to analyze engagement data from mock social media accounts.

## Project Overview

The project involves:
1. Generating mock social media engagement data.
2. Storing and managing the data in a serverless database.
3. Using LangFlow to create analytics workflows.
4. Developing an interactive dashboard to visualize the data.

## Key Features

### 1. Data Generation
- A Python script generates mock social media data including:
  - **Engagement metrics:** Likes, comments, shares, saves.
  - **Sentiment metrics.**
  - **Demographics and device distribution.**
- The generated data is stored in a CSV file.

### 2. Database Integration
- A serverless database is created in **Astra DB**.
- A collection is set up, and the generated CSV file is uploaded to the database.

### 3. LangFlow Implementation
- Components used:
  - AstraDB component.
  - Data Parsing component.
  - Chat input prompt component.
  - ChatGPT component.
  - Chat output component.
- The LangFlow Playground feature was utilized for testing, e.g., analyzing the performance of reels vs. carousels.

### 4. API and Dashboard
- The **LangFlow API** is used to create a Next.js application.
- An interactive dashboard is built with the following components:
  - **Post type performance.**
  - **Engagement over time.**
  - **Content performance.**
  - **Device distribution.**
  - **Engagement vs. comparison rate.**
- The dashboard helps users easily understand the data.

### 5. Chat Assistant
- A chat assistant powered by the LangFlow API answers queries like:
  - "What do people in the age group 16 to 26 engage more with: reels, posts, or carousels?"
- The assistant provides data-driven insights, such as "Carousels are much better than any other form of post."

## Tech Stack
- **LangFlow:** For building analytics workflows.
- **DataStax Astra DB:** For managing the serverless database.
- **Python:** For data generation and processing.
- **Next.js:** For creating the interactive dashboard.

## Installation and Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/parthratra11/Insighter.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Insighter
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up Astra DB and upload the generated CSV file.

5. Run the application:
   ```bash
   python app.py
   ```

6. Access the dashboard and chat assistant features in your browser.

## Contact
For further information or queries, please contact the team:
- **Team Forbes**
- Email: [parthratra11@gmail.com]

---

Thank you for reviewing our project.
