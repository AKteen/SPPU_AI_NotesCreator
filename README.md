<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

LIVE ON : https://sppu-ai-notes-creator-6zp9a4hrq-vipadityak-gmailcoms-projects.vercel.app/

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# SPPU AI Academic Notes

 
*(Replace this with a link to your own screenshot or GIF)*

An intelligent, AI-powered study tool designed specifically for students of Savitribai Phule Pune University (SPPU). This application acts as a personal academic assistant, leveraging the Google Gemini API to provide detailed, syllabus-specific answers to exam questions.

## ✨ Core Features

-   **🤖 AI-Powered Q&A:** Get instant, detailed answers to your academic questions.
-   **📸 Image Upload for PYQs:** Snap a photo of a Previous Year Question (PYQ) paper, upload it, and let the AI analyze and answer the questions.
-   **🎓 SPPU Syllabus Context:** The AI is fine-tuned with a system instruction to answer strictly based on the SPPU curriculum, ensuring relevant and accurate responses.
-   **💾 Persistent Note Saving:** Save any generated question-and-answer pair as a "note" with a single click. All notes are stored in your browser's `localStorage` and persist even after you close the tab.
-   **❓ Multi-Question Handling:** The AI can intelligently identify and answer multiple distinct questions from a single prompt or image.
-   **🌙 Modern Dark UI:** A sleek, responsive, and eye-friendly dark theme built with Tailwind CSS.

## 🛠️ Tech Stack

-   **Frontend:** React, TypeScript
-   **AI Model:** Google Gemini Pro
-   **Styling:** Tailwind CSS
-   **Markdown Parsing:** Showdown.js
-   **State Management:** React Hooks (`useState`, `useEffect`)
-   **Client-Side Storage:** Browser `localStorage` API

## 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sppu-ai-notes.git
    cd sppu-ai-notes
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your Environment Variables:**
    Create a new file named `.env` in the root of your project and add your Google Gemini API key:
    ```
    API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on your local server, typically `http://localhost:5173`.

## ⚙️ How It Works

This is a client-side React application that communicates directly with the Google Gemini API.

1.  When a user submits a prompt (with an optional image), the `geminiService.ts` formats the request.
2.  The request is sent to the Gemini Pro model with a detailed system instruction that guides it to act as an SPPU expert and return a structured JSON response.
3.  The application parses the JSON response and displays the question-and-answer pairs in a clean, readable format.
4.  Saved notes are serialized into a JSON string and stored in the browser's `localStorage`, ensuring they are available in future sessions.

## 👤 Credit

This project was created by **Aditya Kulkarni**.
