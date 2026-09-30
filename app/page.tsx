'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NoteList, { Note } from '@/components/NoteList';
import NoteEditor from '@/components/NoteEditor';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
        if (data.length > 0 && !selectedNoteId) {
          setSelectedNoteId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedNoteId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreateNote = async () => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Untitled Note',
          content: '',
        }),
      });

      if (res.ok) {
        const newNote = await res.json();
        setNotes((prev) => [newNote, ...prev]);
        setSelectedNoteId(newNote.id);
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleSaveNote = async (id: string, title: string, content: string) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        const updated = await res.json();
        setNotes((prev) => {
          const filtered = prev.filter((n) => n.id !== id);
          return [updated, ...filtered];
        });
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (res.ok || res.status === 204) {
        setNotes((prev) => {
          const updated = prev.filter((n) => n.id !== id);
          if (selectedNoteId === id) {
            setSelectedNoteId(updated.length > 0 ? updated[0].id : null);
          }
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      <NoteList
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelectNote={(id) => setSelectedNoteId(id)}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoading={isLoading}
      />
      <NoteEditor
        note={selectedNote}
        onSave={handleSaveNote}
        onDelete={(id) => handleDeleteNote(id)}
        isSaving={isSaving}
      />
    </main>
  );
}
