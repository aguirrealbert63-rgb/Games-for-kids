import React, { useState } from 'react';
import {
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Camera,
  Film,
  Music,
  PartyPopper,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Smartphone,
} from 'lucide-react';
import { DanceMove, CameraViewMode, SceneDefinition } from '../types/nursery';

interface CinemaBottomDockProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  currentTime: number;
  totalDuration: number;
  onSeek: (time: number) => void;
  currentMove: DanceMove;
  onSelectMove: (move: DanceMove) => void;
  currentScene: SceneDefinition;
  allScenes: SceneDefinition[];
  onSelectScene: (scene: SceneDefinition) => void;
  cameraViewMode: CameraViewMode;
  onChangeCamera: (mode: CameraViewMode) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  onTriggerConfetti: () => void;
  onTriggerBubbles: () => void;
  onOpenVideoStudio: () => void;
  onOpenDownloadModal: () => void;
  onOpenMobileInstallModal: () => void;
}

export const CinemaBottomDock: React.FC<CinemaBottomDockProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  currentTime,
  totalDuration,
  onSeek,
  currentMove,
  onSelectMove,
  currentScene,
  allScenes,
  onSelectScene,
  cameraViewMode,
  onChangeCamera,
  playbackSpeed,
  onChangeSpeed,
  volume,
  onChangeVolume,
  onTriggerConfetti,
  onTriggerBubbles,
  onOpenVideoStudio,
  onOpenDownloadModal,
  onOpenMobileInstallModal,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'moves' | 'scenes' | 'camera' | 'fx'>('moves');

  const danceMoves: Array<{ id: DanceMove; label: string; icon: string; color: string }> = [
    { id: 'walking', label: 'Walk', icon: '🚶‍♂️', color: 'bg-emerald-500 hover:bg-emerald-600' },
    { id: 'hopping', label: 'Hop', icon: '🐰', color: 'bg-amber-500 hover:bg-amber-600' },
    { id: 'running', label: 'Run', icon: '🏃‍♀️', color: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'freeze', label: 'Freeze!', icon: '🧊', color: 'bg-cyan-500 hover:bg-cyan-600' },
    { id: 'tiptoe', label: 'Tiptoe', icon: '🩰', color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'skipping', label: 'Skip', icon: '⭐', color: 'bg-pink-500 hover:bg-pink-600' },
    { id: 'jumping', label: 'Jump', icon: '🚀', color: 'bg-indigo-500 hover:bg-indigo-600' },
    { id: 'train', label: 'Train', icon: '🚂', color: 'bg-rose-500 hover:bg-rose-600' },
    { id: 'celebrate', label: 'Party', icon: '🎉', color: 'bg-yellow-500 hover:bg-yellow-600' },
  ];

  const cameraOptions: Array<{ id: CameraViewMode; label: string }> = [
    { id: 'director', label: 'Auto Director' },
    { id: 'orbit', label: '360° Orbit' },
    { id: 'boy', label: 'Leo (Boy)' },
    { id: 'girl', label: 'Lily (Girl)' },
    { id: 'baby', label: 'Baby Pip' },
    { id: 'mom', label: 'Mom' },
    { id: 'overhead', label: 'Overhead' },
  ];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-40 pointer-events-none transition-transform duration-300">
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center mb-1 pointer-events-auto">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/95 text-slate-700 text-xs font-bold rounded-full shadow-md border border-slate-200 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? 'Show Controls' : 'Hide Controls (Zen Mode)'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Cinema Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      {!isCollapsed && (
        <div className="pointer-events-auto bg-white/95 rounded-2xl shadow-2xl border-2 border-rose-200 p-3 sm:p-4 text-slate-800 transition-all">
          {/* Top Row: Playback Bar & Timeline */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pb-3 border-b border-slate-100">
            {/* Play/Pause & Reset buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePlay}
                className={`flex items-center justify-center w-11 h-11 rounded-xl text-white font-bold shadow-md transition-transform active:scale-95 ${
                  isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-rose-500 hover:bg-rose-600'
                }`}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={onReset}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Rewind to start"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Timeline Scrubber */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 w-10 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={totalDuration}
                step={0.5}
                value={currentTime}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <span className="text-xs font-bold text-slate-500 w-10">{formatTime(totalDuration)}</span>
            </div>

            {/* Quick Actions: Speed, Volume, Video Studio */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Tempo / Speed selector */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold text-slate-700">
                {[0.75, 1, 1.25].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => onChangeSpeed(spd)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      playbackSpeed === spd ? 'bg-white shadow-sm font-bold text-rose-600' : 'hover:text-slate-900'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Volume */}
              <button
                onClick={() => onChangeVolume(volume > 0 ? 0 : 0.8)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                title={volume > 0 ? 'Mute' : 'Unmute'}
              >
                {volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
              </button>

              {/* Video Studio Button */}
              <button
                onClick={onOpenVideoStudio}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-95"
                title="Generate AI video using gemini-omni-1.1-flash"
              >
                <Film className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">AI Video Studio</span>
                <span className="sm:hidden">Video</span>
              </button>

              {/* Install on Mobile Devices Button */}
              <button
                onClick={onOpenMobileInstallModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-xs font-bold shadow-md hover:from-pink-600 hover:to-rose-600 transition-all active:scale-95"
                title="Install as native app on iOS or Android"
              >
                <Smartphone className="w-4 h-4 text-amber-200" />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">App</span>
              </button>

              {/* Download Project Button */}
              <button
                onClick={onOpenDownloadModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95"
                title="Download complete project source files"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-2.5 mb-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('moves')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-colors ${
                activeTab === 'moves' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Dance Moves</span>
            </button>

            <button
              onClick={() => setActiveTab('scenes')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-colors ${
                activeTab === 'scenes' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Scenes (1–7)</span>
            </button>

            <button
              onClick={() => setActiveTab('camera')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-colors ${
                activeTab === 'camera' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>

            <button
              onClick={() => setActiveTab('fx')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-colors ${
                activeTab === 'fx' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <PartyPopper className="w-3.5 h-3.5" />
              <span>Fun FX</span>
            </button>
          </div>

          {/* Tab 1: Dance Moves */}
          {activeTab === 'moves' && (
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 pt-1">
              {danceMoves.map((m) => {
                const isSelected = currentMove === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => onSelectMove(m.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-transform active:scale-95 ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300 font-extrabold'
                        : `${m.color} text-white font-bold opacity-90 hover:opacity-100`
                    }`}
                  >
                    <span className="text-lg leading-none mb-1">{m.icon}</span>
                    <span className="text-[11px] leading-tight truncate w-full text-center">{m.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 2: Scenes 1-7 */}
          {activeTab === 'scenes' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 pt-1">
              {allScenes.map((sc) => {
                const isActive = currentScene.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => onSelectScene(sc)}
                    className={`flex flex-col text-left p-2 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase text-rose-600">Scene {sc.id}</span>
                    <span className="text-xs font-bold truncate">{sc.subtitle}</span>
                    <span className="text-[10px] text-slate-500">{formatTime(sc.startTime)} - {formatTime(sc.endTime)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 3: Camera Angles */}
          {activeTab === 'camera' && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cameraOptions.map((cam) => {
                const isSelected = cameraViewMode === cam.id;
                return (
                  <button
                    key={cam.id}
                    onClick={() => onChangeCamera(cam.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cam.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 4: Fun FX */}
          {activeTab === 'fx' && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={onTriggerConfetti}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs rounded-xl shadow-md hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Confetti Explosion!</span>
              </button>

              <button
                onClick={onTriggerBubbles}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold text-xs rounded-xl shadow-md hover:from-sky-500 hover:to-blue-600 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bubble Cloud Burst!</span>
              </button>

              <div className="text-xs text-slate-600 ml-auto font-medium">
                Tip: Click any character in the 3D scene to make them giggle and jump!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
