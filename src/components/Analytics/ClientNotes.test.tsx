import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ClientNotes from './ClientNotes';
import { noteApi } from '@/lib/noteApi';

vi.mock('@/lib/noteApi', () => ({
  noteApi: {
    getNotesByClientId: vi.fn(),
    createNote: vi.fn(),
    updateNote: vi.fn(),
    deleteNote: vi.fn(),
  },
}));

const api = vi.mocked(noteApi);
const existingNote = { id: 1, date: '2026-11-01', content: 'Existing note', tags: ['strength'] };

async function renderNotes() {
  render(<ClientNotes clientId="client-1" />);
  await screen.findByText('Existing note');
}

const newNoteField = () => screen.getByPlaceholderText('Add a new note about this client...') as HTMLTextAreaElement;
const saveNote = () => screen.getByRole('button', { name: 'Save Note' });

function startEditing() {
  fireEvent.click(screen.getByRole('button', { name: 'Edit note' }));
  fireEvent.change(screen.getByDisplayValue('Existing note'), { target: { value: 'Edited text' } });
}

describe('ClientNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    api.getNotesByClientId.mockResolvedValue([existingNote]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('deleting', () => {
    const tapDelete = () => fireEvent.click(screen.getByRole('button', { name: 'Delete note' }));

    it('removes the note after the coach confirms', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      api.deleteNote.mockResolvedValue(undefined);
      await renderNotes();

      tapDelete();

      expect(window.confirm).toHaveBeenCalledTimes(1);
      expect(api.deleteNote).toHaveBeenCalledWith('1');
      expect(await screen.findByText('No notes yet. Add your first note above.')).toBeInTheDocument();
    });

    it('keeps the note when the coach cancels', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      await renderNotes();

      tapDelete();

      expect(api.deleteNote).not.toHaveBeenCalled();
      expect(screen.getByText('Existing note')).toBeInTheDocument();
    });
  });

  describe('when a save fails', () => {
    it('shows an error and keeps the typed text when adding', async () => {
      api.createNote.mockRejectedValue(new Error('500'));
      await renderNotes();

      fireEvent.change(newNoteField(), { target: { value: 'Unsaved recap' } });
      fireEvent.click(saveNote());

      expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't save this note");
      expect(newNoteField().value).toBe('Unsaved recap');
      expect(saveNote()).toBeEnabled();
    });

    it('shows an error and keeps the typed text when editing', async () => {
      api.updateNote.mockRejectedValue(new Error('500'));
      await renderNotes();

      startEditing();
      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't save this note");
      expect(screen.getByDisplayValue('Edited text')).toBeInTheDocument();
    });

    it('clears the error after a retry succeeds', async () => {
      api.createNote.mockRejectedValueOnce(new Error('500'));
      api.createNote.mockResolvedValueOnce({ id: 2, date: '2026-11-02', content: 'Unsaved recap', tags: [] });
      await renderNotes();

      fireEvent.change(newNoteField(), { target: { value: 'Unsaved recap' } });
      fireEvent.click(saveNote());
      await screen.findByRole('alert');
      fireEvent.click(saveNote());

      expect(await screen.findByText('Unsaved recap')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toBeNull();
      expect(newNoteField().value).toBe('');
    });
  });

  describe('while a save is running', () => {
    it('sends one request when Save Note is tapped twice', async () => {
      let finishSave: (note: typeof existingNote) => void = () => undefined;
      api.createNote.mockReturnValue(new Promise(resolve => { finishSave = resolve; }));
      await renderNotes();

      fireEvent.change(newNoteField(), { target: { value: 'New recap' } });
      fireEvent.click(saveNote());
      expect(saveNote()).toBeDisabled();
      fireEvent.click(saveNote());
      expect(api.createNote).toHaveBeenCalledTimes(1);

      await act(async () => finishSave({ id: 2, date: '2026-11-02', content: 'New recap', tags: [] }));
      expect(saveNote()).toBeEnabled();
      expect(screen.getByText('New recap')).toBeInTheDocument();
    });

    it('sends one request when Save Changes is tapped twice', async () => {
      let finishSave: (note: typeof existingNote) => void = () => undefined;
      api.updateNote.mockReturnValue(new Promise(resolve => { finishSave = resolve; }));
      await renderNotes();

      startEditing();
      const saveChanges = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(saveChanges);
      expect(saveChanges).toBeDisabled();
      fireEvent.click(saveChanges);
      expect(api.updateNote).toHaveBeenCalledTimes(1);

      await act(async () => finishSave({ ...existingNote, content: 'Edited text' }));
      expect(screen.getByText('Edited text')).toBeInTheDocument();
    });
  });
});
