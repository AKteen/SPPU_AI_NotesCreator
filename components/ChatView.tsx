import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SingleQnA } from '../types';
import { SendIcon, SaveIcon, LoaderIcon, AcademicCapIcon, PaperclipIcon, XCircleIcon } from './icons';

declare var showdown: any;

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, image?: { data: string, mimeType: string }) => void;
  onSaveNote: (question: string, answer: string) => void;
  isLoading: boolean;
  error: string | null;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage, onSaveNote, isLoading, error }) => {
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const markdownConverter = new showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const base64 = await fileToBase64(file);
      setImageBase64(base64);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageBase64(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || imageFile) && !isLoading) {
      const imagePayload = imageFile && imageBase64 ? { data: imageBase64, mimeType: imageFile.type } : undefined;
      onSendMessage(input.trim(), imagePayload);
      setInput('');
      handleRemoveImage();
    }
  };

  const renderMessagePart = (qna: SingleQnA, index: number, total: number) => {
    const answerHtml = markdownConverter.makeHtml(qna.answer);
    return (
        <div key={index} className={`py-6 ${index < total - 1 ? 'border-b border-gray-800' : ''}`}>
            <div className="flex items-start gap-4 mb-4">
                <span className="text-gray-400 font-bold text-2xl flex-shrink-0">Q:</span>
                <h3 className="font-semibold text-2xl text-gray-50">{qna.question}</h3>
            </div>
            <div
                className="prose prose-invert max-w-full text-gray-300
                           prose-p:text-xl prose-p:leading-relaxed
                           prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                           prose-h1:leading-relaxed prose-h2:leading-relaxed prose-h3:leading-relaxed
                           prose-ul:text-xl prose-ul:leading-relaxed prose-ol:text-xl prose-ol:leading-relaxed prose-li:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: answerHtml }}
            />
            <div className="flex justify-end mt-6">
                <button
                    onClick={() => onSaveNote(qna.question, qna.answer)}
                    className="flex items-center space-x-1.5 text-base text-gray-400 hover:text-gray-200 font-medium transition-colors"
                >
                    <SaveIcon className="h-5 w-5" />
                    <span>Save Note</span>
                </button>
            </div>
        </div>
    );
  };
  
  return (
    <div className="flex-1 flex flex-col h-full bg-black">
      <div ref={chatEndRef} className="flex-grow p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gray-600 flex items-center justify-center text-white"><AcademicCapIcon className="h-5 w-5"/></div>}
              <div className={`w-full ${msg.role === 'user' ? 'max-w-xl p-4 rounded-xl shadow bg-gray-700 text-white' : 'max-w-5xl'}`}>
                {msg.image && (
                  <img src={`data:${msg.image.mimeType};base64,${msg.image.data}`} alt="User upload" className="rounded-lg mb-2 max-h-60" />
                )}
                {msg.parts.map((part, partIndex) => {
                  // FIX: Use a more robust type guard to correctly narrow the 'ChatPart' type.
                  // Checking for the 'text' property ensures 'part' is a 'TextPart' and allows access to 'part.text'.
                  if ('text' in part) {
                    if (msg.role === 'model') {
                      return <p key={partIndex} className="whitespace-pre-wrap text-lg text-gray-200">{part.text}</p>;
                    }
                    return <p key={partIndex} className="whitespace-pre-wrap text-lg">{part.text}</p>;
                  } else {
                    return <div key={partIndex}>{part.qnas.map((qna, idx) => renderMessagePart(qna, idx, part.qnas.length))}</div>;
                  }
                })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 justify-start">
               <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gray-600 flex items-center justify-center text-white"><AcademicCapIcon className="h-5 w-5"/></div>
              <div className="p-4 rounded-xl">
                <div className="flex items-center space-x-3 text-gray-400">
                  <LoaderIcon className="h-6 w-6 animate-spin" />
                  <span className="text-base">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          {error && (
             <div className="flex items-start gap-4 justify-start">
               <div className="flex-shrink-0 h-9 w-9 rounded-full bg-red-500 flex items-center justify-center text-white">!</div>
              <div className="max-w-xl p-4 rounded-xl bg-red-900/50 text-red-200 border border-red-800">
                <p className="font-semibold text-base">Error</p>
                <p className="text-base">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          {imageFile && (
            <div className="relative w-32 mb-3">
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className="rounded-lg h-32 w-32 object-cover" />
              <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-0.5 hover:bg-red-500">
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <PaperclipIcon className="h-6 w-6" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or describe the image..."
              className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-base text-gray-200 placeholder:text-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !imageFile)}
              className="p-4 bg-gray-600 text-white rounded-lg disabled:bg-gray-800 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors duration-200"
            >
              <SendIcon className="h-6 w-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatView;