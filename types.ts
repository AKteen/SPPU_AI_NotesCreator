export interface SingleQnA {
  question: string;
  answer: string;
}

export interface MultiQnAPart {
  isMulti: true;
  qnas: SingleQnA[];
}

export interface TextPart {
  isMulti?: false;
  text: string;
}

export type ChatPart = MultiQnAPart | TextPart;

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatPart[];
  image?: {
    data: string; // base64 string
    mimeType: string;
  }
}

export interface SavedNote {
  id: string;
  question: string;
  answer: string;
}

export interface GeminiResponseFormat {
  questionsAndAnswers: SingleQnA[];
}