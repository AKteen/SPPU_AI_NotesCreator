import React from 'react';
import { SavedNote } from '../types';
import { BookOpenIcon } from './icons';

interface NoteViewProps {
  note: SavedNote;
}

const NoteView: React.FC<NoteViewProps> = ({ note }) => {
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-black">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg p-8">
        <div className="flex items-center mb-6">
          <BookOpenIcon className="h-7 w-7 text-gray-400 mr-4" />
          <h1 className="text-3xl font-bold text-white">{note.question}</h1>
        </div>
        <div 
          className="prose prose-lg prose-invert max-w-none text-gray-300" 
          dangerouslySetInnerHTML={{ __html: note.answer.replace(/\n/g, '<br />') }}
        />
      </div>
    </div>
  );
};

export default NoteView;