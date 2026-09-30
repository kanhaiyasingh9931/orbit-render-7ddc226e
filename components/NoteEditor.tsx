'use client';

import React, { useState, useEffect } from 'react';
import { Save, Trash2, Check, Clock } from 'lucide-react';
import { Note } from './NoteList';

interface NoteEditorProps {
  note: Note | null;
  onSave: (id: string, title: string, content: string) => Promise<void>;
  onDelete: (id: string) => void;
  isSaving: boolean;
}

export default function NoteEditor({
  note,
  onSave,
  onDelete,
  isSaving,
}: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [savedStatus, setSavedStatus] = useState<'idle' | 'saved' | 'saving'>('idle');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSavedStatus('idle');
    } else {
      setTitle('');
      setContent('');
      setSavedStatus('idle');
    }
  }, [note]);

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-400 p-8 h-full">
        <div className="max-w-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-slate-300">No Note Selected</h2>
          <p className="text-xs text-slate-500">
            Select a note from the list on the left or create a new note to start editing.
          </p>
        </div>
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleManualSave = async () => {
    if (!note) return;
    setSavedStatus('saving');
    await onSave(note.id, title, content);
    setSavedStatus('saved');
    setTimeout(() => setSavedStatus('idle'), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100">
      <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>
            Last updated: {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {savedStatus === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(note.id)}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
          <button
            onClick={handleManualSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto max-w-4xl w-full mx-auto">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="w-full bg-transparent text-2xl font-bold text-white placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-slate-800 pb-2 transition-colors"
        />
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your note here..."
          className="w-full flex-1 bg-transparent text-slate-200 placeholder-slate-600 resize-none focus:outline-none text-base leading-relaxed"
        />
      </div>
    </div>
  );
}
