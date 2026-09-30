import React, { useState } from 'react';
import { Team } from '../data/types';
import { X, Users, Plus, Trash2, RotateCcw, Trophy, Check } from 'lucide-react';

interface TeamManagerModalProps {
  teams: Team[];
  isTeamMode: boolean;
  onUpdateTeams: (teams: Team[]) => void;
  onToggleTeamMode: (active: boolean) => void;
  onClose: () => void;
  onStartTournament: () => void;
}

export const TeamManagerModal: React.FC<TeamManagerModalProps> = ({
  teams,
  isTeamMode,
  onUpdateTeams,
  onToggleTeamMode,
  onClose,
  onStartTournament
}) => {
  const [localTeams, setLocalTeams] = useState<Team[]>(teams);

  const handleNameChange = (id: string, name: string) => {
    setLocalTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name } : t))
    );
  };

  const handleAddTeam = () => {
    if (localTeams.length >= 4) return;
    const defaultNames = ['Hyderabad Heroes', 'Mass Maharajas', 'Vizag Victors', 'Rayalaseema Rebels'];
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name: defaultNames[localTeams.length] || `Team ${localTeams.length + 1}`,
      score: 0,
      avatarColor: 'from-amber-500 to-red-600'
    };
    setLocalTeams([...localTeams, newTeam]);
  };

  const handleRemoveTeam = (id: string) => {
    if (localTeams.length <= 2) return;
    setLocalTeams(localTeams.filter((t) => t.id !== id));
  };

  const handleResetScores = () => {
    setLocalTeams(localTeams.map((t) => ({ ...t, score: 0 })));
  };

  const handleSaveAndApply = () => {
    onUpdateTeams(localTeams);
    onToggleTeamMode(true);
    onStartTournament();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#21110a] to-[#140704] border border-amber-600/40 p-5 sm:p-7 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-100">
                Team Party Mode
              </h2>
              <p className="text-xs text-amber-300/70">
                Compete across multiple rounds with live scores
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

        {/* Team List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {localTeams.map((team, idx) => (
            <div 
              key={team.id}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#2b170f] border border-amber-900/50"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-black font-black text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </div>

              <input
                type="text"
                value={team.name}
                maxLength={24}
                onChange={(e) => handleNameChange(team.id, e.target.value)}
                className="flex-1 bg-black/40 border border-amber-900/50 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-amber-100 focus:outline-none focus:border-amber-500"
              />

              <div className="text-xs font-mono font-bold text-amber-300 px-2">
                {team.score} pts
              </div>

              {localTeams.length > 2 && (
                <button
                  onClick={() => handleRemoveTeam(team.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/50 transition"
                  title="Remove Team"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Team button & Reset button */}
        <div className="flex items-center justify-between gap-2 text-xs">
          {localTeams.length < 4 ? (
            <button
              onClick={handleAddTeam}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 font-bold transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Team ({localTeams.length}/4)</span>
            </button>
          ) : (
            <span className="text-amber-400/60 text-xs">Max 4 Teams reached</span>
          )}

          <button
            onClick={handleResetScores}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-amber-400/80 hover:text-amber-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Scores</span>
          </button>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <button
            onClick={handleSaveAndApply}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-black font-extrabold text-sm tracking-wide shadow-xl active:scale-98 transition"
          >
            <Trophy className="w-4 h-4" />
            <span>Start Team Battle Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
