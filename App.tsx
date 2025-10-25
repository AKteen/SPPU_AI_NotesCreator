import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import NoteView from './components/NoteView';
import { ChatMessage, SavedNote } from './types';
import { getAnswers } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'chat' | 'note'>('chat');
  const [currentNote, setCurrentNote] = useState<SavedNote | null>(null);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    try {
      const notes = localStorage.getItem('sppu-ai-notes');
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error("Failed to parse saved notes from localStorage", error);
      return [];
    }
  });

  const initialChatState: ChatMessage[] = [
    {
      role: 'model',
      parts: [{ text: "Hello! I'm your SPPU academic assistant. How can I help you prepare for your exams today? You can also upload an image of a question paper." }]
    }
  ];

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(initialChatState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('sppu-ai-notes', JSON.stringify(savedNotes));
    } catch (error) {
      console.error("Failed to save notes to localStorage", error);
    }
  }, [savedNotes]);

  const handleSelectNote = (note: SavedNote) => {
    setCurrentNote(note);
    setView('note');
  };

  const handleNewChat = () => {
    setCurrentNote(null);
    setView('chat');
    setChatHistory(initialChatState);
    setError(null);
  };

  const handleSaveNote = useCallback((question: string, answer: string) => {
    setSavedNotes((prevNotes) => {
      const isAlreadySaved = prevNotes.some(note => note.question === question && note.answer === answer);
      if (isAlreadySaved) {
        return prevNotes;
      }
      const newNote: SavedNote = { id: new Date().toISOString(), question, answer };
      return [newNote, ...prevNotes];
    });
  }, []);

  const handleSendMessage = async (message: string, image?: { data: string; mimeType: string }) => {
    setError(null);
    setIsLoading(true);
    
    const userMessage: ChatMessage = { role: 'user', parts: [{ text: message || 'Please analyze this image.' }], image };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      const qnaArray = await getAnswers(message || 'Please answer the questions in this image based on the SPPU syllabus.', image);

      if (qnaArray && qnaArray.length > 0) {
        const modelResponse: ChatMessage = {
          role: 'model',
          parts: [{ isMulti: true, qnas: qnaArray }]
        };
        setChatHistory(prev => [...prev, modelResponse]);
      } else {
        const emptyResponse: ChatMessage = {
          role: 'model',
          parts: [{ text: "I couldn't find a specific answer for that. Could you please rephrase your question or try a different image?" }]
        };
        setChatHistory(prev => [...prev, emptyResponse]);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen font-sans bg-black text-gray-200">
      <Sidebar 
        savedNotes={savedNotes}
        onSelectNote={handleSelectNote}
        onNewChat={handleNewChat}
        activeNoteId={view === 'note' ? currentNote?.id || null : null}
      />
      <main className="flex-1 flex flex-col h-full">
        {view === 'chat' ? (
          <ChatView
            messages={chatHistory}
            onSendMessage={handleSendMessage}
            onSaveNote={handleSaveNote}
            isLoading={isLoading}
            error={error}
          />
        ) : currentNote ? (
          <NoteView note={currentNote} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>Select a note to view or start a new chat.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;