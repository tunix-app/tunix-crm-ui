import React, { useState } from 'react';
import { EditIcon, TrashIcon, SaveIcon, PlusIcon } from 'lucide-react';
interface ClientNotesProps {
  clientId: string;
  limit?: number;
  showEditor?: boolean;
}
interface Note {
  id: number;
  date: string;
  content: string;
  tags: string[];
}
const ClientNotes = ({
  clientId,
  limit = 10,
  showEditor = false
}: ClientNotesProps) => {
  const [newNote, setNewNote] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedTags, setEditedTags] = useState('');
  const [showAllNotes, setShowAllNotes] = useState(false);
  // Mock notes data
  const [notes, setNotes] = useState<Note[]>([{
    id: 1,
    date: '2023-06-15',
    content: 'Emma showed great progress in her squat form today. We focused on bracing and depth. Her mobility has improved significantly since we started working on hip flexor stretches.',
    tags: ['strength', 'form', 'mobility']
  }, {
    id: 2,
    date: '2023-06-08',
    content: 'Noticed some discomfort in right shoulder during overhead pressing. Scaled back weight and focused on technique. Will monitor next session and possibly refer to PT if it persists.',
    tags: ['injury', 'caution', 'shoulder']
  }, {
    id: 3,
    date: '2023-06-01',
    content: 'Completed initial assessment. Emma has good baseline strength but limited mobility in hips and ankles. Will focus on mobility work before ramping up strength training.',
    tags: ['assessment', 'mobility', 'planning']
  }, {
    id: 4,
    date: '2023-05-25',
    content: 'Discussed nutrition goals today. Emma is tracking macros and aiming for 1800 calories with 140g protein daily. Will check in weekly on adherence.',
    tags: ['nutrition', 'goals']
  }]);
  // Add a new note
  const handleAddNote = () => {
    if (newNote.trim() === '') return;
    const newNoteObj: Note = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      content: newNote,
      tags: newNoteTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };
    setNotes([newNoteObj, ...notes]);
    setNewNote('');
    setNewNoteTags('');
  };
  // Start editing a note
  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditedContent(note.content);
    setEditedTags(note.tags.join(', '));
  };
  // Save edited note
  const handleSaveEdit = () => {
    if (editingNoteId === null) return;
    const updatedNotes = notes.map(note => {
      if (note.id === editingNoteId) {
        return {
          ...note,
          content: editedContent,
          tags: editedTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        };
      }
      return note;
    });
    setNotes(updatedNotes);
    setEditingNoteId(null);
    setEditedContent('');
    setEditedTags('');
  };
  // Delete a note
  const handleDeleteNote = (id: number) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
  };
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditedContent('');
    setEditedTags('');
  };
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  // Get current time for display
  const getCurrentTime = (): string => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  // Determine which notes to display
  const displayedNotes = showAllNotes ? notes : notes.slice(0, limit);
  return <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4">
        <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a new note about this client..." className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" rows={4} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1">
            <input type="text" value={newNoteTags} onChange={e => setNewNoteTags(e.target.value)} placeholder="Add tags separated by commas (e.g. strength, mobility)" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
          </div>
          <button onClick={handleAddNote} className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700">
            <SaveIcon size={16} className="mr-2" />
            Save Note
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Note will be timestamped with the current date (
          {formatDate(new Date().toISOString().split('T')[0])}) and time (
          {getCurrentTime()})
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Client Notes History</h3>
        {notes.length > limit && <button onClick={() => setShowAllNotes(!showAllNotes)} className="text-sm text-amber-600 hover:text-amber-800">
            {showAllNotes ? 'Show Recent' : 'Show All Notes'}
          </button>}
      </div>

      <div className="space-y-4">
        {displayedNotes.length > 0 ? displayedNotes.map(note => <div key={note.id} className="border border-gray-200 rounded-lg p-4">
              {editingNoteId === note.id ?
        // Edit mode
        <>
                  <textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" rows={4} />
                  <div className="mt-3">
                    <input type="text" value={editedTags} onChange={e => setEditedTags(e.target.value)} placeholder="Tags separated by commas" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button onClick={handleCancelEdit} className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                      Cancel
                    </button>
                    <button onClick={handleSaveEdit} className="px-3 py-1 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700">
                      Save Changes
                    </button>
                  </div>
                </> :
        // View mode
        <>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(note.date)}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map(tag => <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {tag}
                          </span>)}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button onClick={() => handleEditNote(note)} className="p-1 rounded-md hover:bg-gray-100">
                        <EditIcon size={16} className="text-gray-500" />
                      </button>
                      <button onClick={() => handleDeleteNote(note.id)} className="p-1 rounded-md hover:bg-gray-100">
                        <TrashIcon size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{note.content}</p>
                </>}
            </div>) : <div className="text-center py-8 border border-gray-200 rounded-lg">
            <p className="text-gray-500">
              No notes yet. Add your first note above.
            </p>
          </div>}
      </div>

      {notes.length > 0 && !showAllNotes && notes.length > limit && <div className="text-center">
          <button onClick={() => setShowAllNotes(true)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <PlusIcon size={16} className="mr-2" />
            View {notes.length - limit} More Notes
          </button>
        </div>}
    </div>;
};
export default ClientNotes;