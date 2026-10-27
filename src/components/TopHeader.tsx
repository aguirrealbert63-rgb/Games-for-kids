import React from 'react';
import { Film, Maximize2, Sparkles, Smile, Download, Smartphone } from 'lucide-react';

interface TopHeaderProps {
  currentSceneNumber: number;
  currentSceneTitle: string;
  onOpenVideoStudio: () => void;
  onOpenDownloadModal: () => void;
  onOpenMobileInstallModal: () => void;
  clickedCharacterMessage: string | null;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentSceneNumber,
  currentSceneTitle,
  onOpenVideoStudio,
  onOpenDownloadModal,
  onOpenMobileInstallModal,
  clickedCharacterMessage,
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-40 pointer-events-none flex items-start justify-between">
      {/* Brand & Scene Badge */}
      <div className="pointer-events-auto flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5 bg-white/95 px-4 py-2 rounded-2xl shadow-lg border-2 border-rose-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-none">
              Let's Move and Dance!
            </h1>
            <p className="text-[11px] font-bold text-rose-600 mt-0.5">
              3D Musical Nursery Rhyme for Kids (1–5)
            </p>
          </div>
        </div>

        {/* Scene Indicator */}
        <div className="inline-flex items-center gap-1.5 bg-purple-600/90 text-white px-3 py-1 rounded-xl shadow-md text-xs font-bold w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Scene {currentSceneNumber}: {currentSceneTitle}</span>
        </div>

        {/* Character giggle message toast */}
        {clickedCharacterMessage && (
          <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-lg">
            <Smile className="w-4 h-4" />
            <span>{clickedCharacterMessage}</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* AI Video Studio Button */}
        <button
          onClick={onOpenVideoStudio}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transition-transform active:scale-95 border border-purple-400/30"
          title="Open AI Video Studio"
        >
          <Film className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">AI Video Studio</span>
          <span className="sm:hidden">Video</span>
        </button>

        {/* Install on Mobile Devices Button */}
        <button
          onClick={onOpenMobileInstallModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transition-transform active:scale-95 border border-pink-300/30"
          title="Install App on iPhone, iPad or Android"
        >
          <Smartphone className="w-4 h-4 text-amber-200" />
          <span className="hidden sm:inline">Install on Phone</span>
          <span className="sm:hidden">Install</span>
        </button>

        {/* Download Project Button */}
        <button
          onClick={onOpenDownloadModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transition-transform active:scale-95 border border-emerald-400/30"
          title="Download Project ZIP and Files"
        >
          <Download className="w-4 h-4 text-emerald-200" />
          <span className="hidden sm:inline">Download</span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 rounded-2xl bg-white/95 text-slate-700 hover:bg-slate-100 flex items-center justify-center shadow-lg border border-slate-200 transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
