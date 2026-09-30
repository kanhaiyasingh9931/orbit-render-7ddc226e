'use client';

import React from 'react';
import { Search, Plus, Trash2, FileText } from 'lucide-react';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading: boolean;
}

export default function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  searchQuery,
  onSearchChange,
  isLoading,
}: NoteListProps) {
  const filteredNotes = notes.filter((note) => {
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full md:w-80 bg-slate-900 text-slate-100 flex flex-col h-full border-r border-slate-800 shrink-0">
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Notes App
          </h1>
          <button
            onClick={onCreateNote}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-slate-400">Loading notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 space-y-2">
            <p className="font-medium text-slate-400">No notes found</p>
            <p className="text-xs">
              {searchQuery
                ? 'Try a different search term'
                : 'Click "New" to create your first note.'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isSelected = note.id === selectedNoteId;
            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`group relative p-4 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-slate-800/90 border-l-4 border-indigo-500'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={`text-sm font-semibold truncate ${
                      isSelected ? 'text-indigo-200' : 'text-slate-200'
                    }`}
                  >
                    {note.title || 'Untitled Note'}
                  </h3>
                  <button
                    onClick={(e) => onDeleteNote(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-all"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {note.content || 'No content...'}
                </p>
                <span className="text-[10px] text-slate-500 block mt-2">
                  {formatDate(note.updatedAt)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
