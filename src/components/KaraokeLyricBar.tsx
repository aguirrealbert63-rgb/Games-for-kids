import React from 'react';
import { Sparkles, Music2, Footprints } from 'lucide-react';

interface KaraokeLyricBarProps {
  sceneTitle: string;
  lyrics: string;
  instructions: string;
  currentTimeFormatted: string;
  durationFormatted: string;
  progressPercent: number;
}

export const KaraokeLyricBar: React.FC<KaraokeLyricBarProps> = ({
  sceneTitle,
  lyrics,
  instructions,
  currentTimeFormatted,
  durationFormatted,
  progressPercent,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 pointer-events-auto">
      {/* Top action prompt pill */}
      <div className="flex items-center justify-between mb-2">
        <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold shadow-md tracking-wide">
          <Footprints className="w-4 h-4 text-amber-900" />
          <span>{instructions}</span>
        </div>
        <div className="text-xs font-bold text-slate-800 bg-white/90 px-2.5 py-1 rounded-full shadow-sm">
          {currentTimeFormatted} / {durationFormatted}
        </div>
      </div>

      {/* Main Karaoke Card */}
      <div className="relative bg-white/95 rounded-2xl shadow-xl p-3 sm:p-4 border-2 border-rose-300">
        {/* Progress bar line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-100 rounded-t-2xl overflow-hidden">
          <div
            className="h-full bg-rose-500 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shrink-0 shadow-md">
            <Music2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-0.5">
              <span>{sceneTitle}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-base sm:text-xl font-extrabold text-slate-900 leading-snug line-clamp-2">
              "{lyrics}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
