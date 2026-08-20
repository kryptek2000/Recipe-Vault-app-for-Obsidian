import React from 'react';
import { Play, Pause, X, Bell, Plus } from 'lucide-react';
import { ActiveTimer } from '../types';

interface ActiveTimersBarProps {
  timers: ActiveTimer[];
  onToggleTimer: (id: string) => void;
  onDeleteTimer: (id: string) => void;
  onAddCustomTimer: () => void;
}

export function ActiveTimersBar({
  timers,
  onToggleTimer,
  onDeleteTimer,
  onAddCustomTimer,
}: ActiveTimersBarProps) {
  if (timers.length === 0) return null;

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  return (
    <div
      id="active-timers-dock"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-[#141414]/95 text-gray-200 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-3 sm:p-4 transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <span className="text-xs sm:text-sm font-medium tracking-wide text-white">
            Active Kitchen Timers ({timers.length})
          </span>
        </div>
        <button
          id="add-custom-timer-btn"
          onClick={onAddCustomTimer}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Timer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
        {timers.map((timer) => {
          const progress = Math.max(0, Math.min(100, ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100));
          const isDone = timer.remainingSeconds <= 0;

          return (
            <div
              key={timer.id}
              id={`timer-card-${timer.id}`}
              className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border ${
                isDone
                  ? 'bg-rose-950/70 border-rose-500 animate-pulse text-rose-200'
                  : 'bg-[#0C0C0C] border-white/5 text-gray-100'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium truncate text-gray-200" title={timer.label}>
                    {timer.label}
                  </span>
                  <span className={`font-mono font-bold text-sm ${isDone ? 'text-rose-400' : 'text-amber-400'}`}>
                    {isDone ? 'DONE!' : formatTime(timer.remainingSeconds)}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isDone ? 'bg-rose-500' : timer.isRunning ? 'bg-amber-400' : 'bg-gray-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">
                  {timer.recipeTitle}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {!isDone && (
                  <button
                    id={`toggle-timer-${timer.id}`}
                    onClick={() => onToggleTimer(timer.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-colors"
                    title={timer.isRunning ? 'Pause' : 'Resume'}
                  >
                    {timer.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </button>
                )}
                <button
                  id={`dismiss-timer-${timer.id}`}
                  onClick={() => onDeleteTimer(timer.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
                  title="Dismiss timer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
