import React, { useState } from 'react';
import { CustomDeck, GameCard } from '../data/types';
import { X, Plus, Trash2, Play, FolderPlus, Edit2, Copy, Check } from 'lucide-react';

interface CustomDecksModalProps {
  customDecks: CustomDeck[];
  onSaveDecks: (decks: CustomDeck[]) => void;
  onPlayCustomDeck: (deck: CustomDeck) => void;
  onClose: () => void;
}

export const CustomDecksModal: React.FC<CustomDecksModalProps> = ({
  customDecks,
  onSaveDecks,
  onPlayCustomDeck,
  onClose
}) => {
  const [editingDeck, setEditingDeck] = useState<CustomDeck | null>(null);
  const [newCardAnswer, setNewCardAnswer] = useState<string>('');
  const [newCardSubtext, setNewCardSubtext] = useState<string>('');

  const handleCreateNew = () => {
    const blankDeck: CustomDeck = {
      id: `custom_${Date.now()}`,
      title: 'My Custom Deck',
      description: 'Custom words for our party!',
      createdAt: Date.now(),
      cards: [
        { id: '1', answer: 'First Card', subtext: 'Clue hint' },
        { id: '2', answer: 'Second Card', subtext: 'Clue hint' },
        { id: '3', answer: 'Third Card', subtext: 'Clue hint' },
        { id: '4', answer: 'Fourth Card', subtext: 'Clue hint' }
      ]
    };
    setEditingDeck(blankDeck);
  };

  const handleSaveDeck = () => {
    if (!editingDeck) return;
    if (editingDeck.cards.length < 4) {
      alert('Please add at least 4 cards to the deck!');
      return;
    }
    const exists = customDecks.some((d) => d.id === editingDeck.id);
    const updated = exists
      ? customDecks.map((d) => (d.id === editingDeck.id ? editingDeck : d))
      : [editingDeck, ...customDecks];

    onSaveDecks(updated);
    setEditingDeck(null);
  };

  const handleDeleteDeck = (id: string) => {
    if (confirm('Are you sure you want to delete this custom deck?')) {
      onSaveDecks(customDecks.filter((d) => d.id !== id));
    }
  };

  const handleDuplicateDeck = (deck: CustomDeck) => {
    const duplicated: CustomDeck = {
      ...deck,
      id: `custom_${Date.now()}`,
      title: `${deck.title} (Copy)`,
      createdAt: Date.now()
    };
    onSaveDecks([duplicated, ...customDecks]);
  };

  const handleAddCardToEdit = () => {
    if (!editingDeck || !newCardAnswer.trim()) return;
    if (editingDeck.cards.length >= 100) {
      alert('Maximum 100 cards allowed per deck.');
      return;
    }
    const newCard = {
      id: `c_${Date.now()}`,
      answer: newCardAnswer.trim(),
      subtext: newCardSubtext.trim() || undefined
    };
    setEditingDeck({
      ...editingDeck,
      cards: [...editingDeck.cards, newCard]
    });
    setNewCardAnswer('');
    setNewCardSubtext('');
  };

  const handleRemoveCardFromEdit = (cardId: string) => {
    if (!editingDeck) return;
    setEditingDeck({
      ...editingDeck,
      cards: editingDeck.cards.filter((c) => c.id !== cardId)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#21110a] to-[#120704] border border-amber-600/40 p-5 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-100">
                {editingDeck ? 'Deck Editor' : 'Custom Decks'}
              </h2>
              <p className="text-xs text-amber-300/70">
                {editingDeck ? 'Create cards for your party' : 'Play with your own secret words & inside jokes'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-amber-400 hover:text-white hover:bg-amber-950/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deck List or Editor */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {editingDeck ? (
            /* EDITOR MODE */
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Deck Title
                </label>
                <input
                  type="text"
                  value={editingDeck.title}
                  onChange={(e) => setEditingDeck({ ...editingDeck, title: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/60 rounded-xl px-3 py-2 text-sm font-bold text-amber-100 focus:outline-none focus:border-amber-500"
                  placeholder="e.g., Office Gossip, Family Names..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Description
                </label>
                <input
                  type="text"
                  value={editingDeck.description}
                  onChange={(e) => setEditingDeck({ ...editingDeck, description: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/60 rounded-xl px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                  placeholder="Short clue description..."
                />
              </div>

              {/* Add Card Box */}
              <div className="p-3.5 rounded-2xl bg-[#2a160d] border border-amber-800/40 space-y-2.5">
                <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span>Add Card ({editingDeck.cards.length}/100)</span>
                  <span className="text-[11px] text-amber-400/80">Min 4 cards needed</span>
                </label>
                <input
                  type="text"
                  value={newCardAnswer}
                  onChange={(e) => setNewCardAnswer(e.target.value)}
                  className="w-full bg-black/40 border border-amber-900/60 rounded-xl px-3 py-2 text-sm font-bold text-amber-100 focus:outline-none focus:border-amber-500"
                  placeholder="Answer name (e.g. Pavan, Principal, CSE HOD)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCardToEdit();
                  }}
                />
                <input
                  type="text"
                  value={newCardSubtext}
                  onChange={(e) => setNewCardSubtext(e.target.value)}
                  className="w-full bg-black/40 border border-amber-900/60 rounded-xl px-3 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                  placeholder="Optional clue / context..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCardToEdit();
                  }}
                />
                <button
                  onClick={handleAddCardToEdit}
                  disabled={!newCardAnswer.trim()}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add This Card</span>
                </button>
              </div>

              {/* Card List in Deck */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Cards in this deck:
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {editingDeck.cards.map((card, idx) => (
                    <div
                      key={card.id || idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-amber-950 text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-amber-100">{card.answer}</span>
                        {card.subtext && (
                          <span className="ml-2 text-amber-300/60">({card.subtext})</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveCardFromEdit(card.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSaveDeck}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-sm shadow-md"
                >
                  Save Deck ({editingDeck.cards.length} Cards)
                </button>
                <button
                  onClick={() => setEditingDeck(null)}
                  className="px-4 py-3 rounded-xl bg-black/40 border border-amber-900/50 text-amber-300 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* DECK LIST MODE */
            <div className="space-y-3">
              <button
                onClick={handleCreateNew}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border-2 border-dashed border-amber-500/40 text-amber-300 text-xs font-bold transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Custom Deck</span>
              </button>

              {customDecks.length === 0 ? (
                <div className="text-center py-8 text-amber-300/60 text-xs">
                  No custom decks yet. Tap above to create one!
                </div>
              ) : (
                customDecks.map((deck) => (
                  <div
                    key={deck.id}
                    className="p-3.5 rounded-2xl bg-[#26140b] border border-amber-800/40 flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-amber-100 truncate">
                        {deck.title}
                      </h4>
                      <p className="text-xs text-amber-200/60 truncate mt-0.5">
                        {deck.description}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {deck.cards.length} Cards
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onPlayCustomDeck(deck)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition"
                        title="Play"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Play</span>
                      </button>
                      <button
                        onClick={() => setEditingDeck(deck)}
                        className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-amber-900 text-amber-300 text-xs"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateDeck(deck)}
                        className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-amber-900 text-amber-300 text-xs"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDeck(deck.id)}
                        className="p-2 rounded-xl bg-black/40 hover:bg-red-950/40 border border-amber-900 text-red-400 text-xs"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
