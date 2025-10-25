import React from 'react';
import { SavedNote } from '../types';
import { BookOpenIcon, PlusCircleIcon, AcademicCapIcon } from './icons';

interface SidebarProps {
  savedNotes: SavedNote[];
  onSelectNote: (note: SavedNote) => void;
  onNewChat: () => void;
  activeNoteId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ savedNotes, onSelectNote, onNewChat, activeNoteId }) => {
  return (
    <div className="w-full md:w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center space-x-3">
        <AcademicCapIcon className="h-8 w-8 text-gray-400" />
        <h1 className="text-2xl font-bold text-white">SPPU AI Notes</h1>
      </div>

      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center space-x-2 bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span className="text-base">New Chat</span>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <nav className="px-4 pb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4 px-2">PYQs</h2>
          <ul>
            <li>
              <a
                href="https://mysppu.com/question-papers-savitribai-phule-pune-sppu-all-departments/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:bg-gray-800 rounded-md p-2 transition-colors duration-200"
              >
                <BookOpenIcon className="h-5 w-5 text-gray-500" />
                <span className="text-base font-medium">SPPU Question Papers</span>
              </a>
            </li>
          </ul>

          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-8 px-2">Saved Notes</h2>
          {savedNotes.length > 0 ? (
            <ul>
              {savedNotes.map((note) => (
                <li key={note.id}>
                  <button
                    onClick={() => onSelectNote(note)}
                    className={`w-full text-left flex items-center space-x-3 rounded-md p-2 transition-colors duration-200 ${
                      activeNoteId === note.id
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <span className="truncate text-base font-medium">{note.question}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base text-gray-400 mt-2 px-2">No notes saved yet.</p>
          )}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-800 text-xs text-center text-gray-500">
        <p>© 2025 SPPU AI Assistant.</p>
        <p>Created by Aditya Kulkarni.</p>
      </div>
    </div>
  );
};

export default Sidebar;