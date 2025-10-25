import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponseFormat, SingleQnA } from '../types';

const SYSTEM_INSTRUCTION = `You are an expert academic assistant specializing in the syllabus of Savitribai Phule Pune University (SPPU). Your primary function is to answer student's exam questions. You will sometimes receive images of question papers (PYQs).

VERY IMPORTANT RULES:
1.  **Analyze All Inputs**: Carefully analyze both the text prompt and any accompanying image. The image may contain questions you need to answer.
2.  **Strictly SPPU Context**: Base ALL your answers exclusively on the known curriculum, concepts, and materials from the SPPU syllabus. Do not use external knowledge unless it's a fundamental concept clearly within the SPPU curriculum.
3.  **Handle Multiple Questions**: The user may ask multiple questions in a single prompt or in an image. You MUST identify each distinct question and provide a separate, comprehensive answer for each one.
4.  **JSON Output**: You MUST format your entire response as a single JSON object. The object should have one key: "questionsAndAnswers", which is an array of objects. Each object in the array must have two keys: "question" (the user's question you identified) and "answer" (your detailed answer).
5.  **Engaging & Formatted Answers**: Provide answers that are detailed, well-structured, and easy to understand. Use markdown for formatting (like **bold** for headings, and lists). Use relevant emojis (like 📚, ✨, 💡, ✅) to make the answers more engaging and friendly.

Example user prompt with an image of a question paper: "Please answer Q.1 and Q.2 from the attached image."

Example JSON response:
{
  "questionsAndAnswers": [
    {
      "question": "Explain various transport layer services.",
      "answer": "Of course! 📚 The transport layer provides crucial services to the application layer, ensuring reliable and efficient communication between hosts. According to the SPPU syllabus, the key services include:\\n\\n**1. Type of Service:**\\n   - **Connection-Oriented:** Provides a reliable, dedicated connection (like TCP). ✨\\n   - **Connectionless:** Offers a faster, less reliable datagram service (like UDP).\\n\\n**2. Quality of Service (QoS):**\\n   - Manages parameters like error rates, delay, throughput, and priority to meet application requirements. 💡\\n\\n**3. Data Transfer:**\\n   - Handles the segmentation of data from the application layer and ensures it's transferred efficiently.\\n\\n**4. Security:**\\n   - Can provide security mechanisms like encryption to protect the data in transit. ✅"
    }
  ]
}
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        questionsAndAnswers: {
            type: Type.ARRAY,
            description: "An array of question and answer objects.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The specific question identified from the user's prompt or image."
                    },
                    answer: {
                        type: Type.STRING,
                        description: "A detailed, well-structured answer using markdown and emojis, based on the SPPU syllabus."
                    }
                },
                required: ["question", "answer"]
            }
        }
    },
    required: ["questionsAndAnswers"]
};

export const getAnswers = async (prompt: string, image?: { mimeType: string; data: string }): Promise<SingleQnA[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const model = image ? 'gemini-2.5-pro' : 'gemini-2.5-pro';

  const contentParts = [];
  if (image) {
    contentParts.push({
      inlineData: {
        mimeType: image.mimeType,
        data: image.data,
      },
    });
  }
  contentParts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: contentParts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      }
    });

    const jsonText = response.text.trim();
    const parsedResponse: GeminiResponseFormat = JSON.parse(jsonText);
    
    return parsedResponse.questionsAndAnswers || [];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("The AI model returned an invalid format. Please try rephrasing your question.");
    }
    throw new Error("An error occurred while fetching answers. Please try again.");
  }
};