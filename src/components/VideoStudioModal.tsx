import React, { useState } from 'react';
import {
  X,
  Film,
  Sparkles,
  Download,
  AlertCircle,
  Loader2,
  Tv,
  Smartphone,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { SceneDefinition } from '../types/nursery';

interface VideoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: SceneDefinition[];
  currentSceneId: number;
}

interface GeneratedVideo {
  id: string;
  url: string;
  sceneTitle: string;
  aspectRatio: string;
  duration: string;
  timestamp: string;
}

export const VideoStudioModal: React.FC<VideoStudioModalProps> = ({
  isOpen,
  onClose,
  scenes,
  currentSceneId,
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<number>(currentSceneId || 1);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [duration, setDuration] = useState<'5s' | '10s'>('5s');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];
  const [customPrompt, setCustomPrompt] = useState<string>(selectedScene.videoPrompt);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeVideo, setActiveVideo] = useState<GeneratedVideo | null>(null);
  const [videoHistory, setVideoHistory] = useState<GeneratedVideo[]>([]);

  // When switching scenes, update the prompt
  const handleSelectScene = (sceneId: number) => {
    setSelectedSceneId(sceneId);
    const target = scenes.find((s) => s.id === sceneId);
    if (target) {
      setCustomPrompt(target.videoPrompt);
      setIsEditingPrompt(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationProgress('Connecting to Gemini Omni Flash (gemini-omni-1.1-flash)...');
    setElapsedSeconds(0);

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    try {
      setGenerationProgress('Synthesizing 3D animation frames and motion vectors...');

      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          aspectRatio,
          duration,
          resolution,
          sceneTitle: selectedScene.title,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate video with gemini-omni-1.1-flash');
      }

      const newVideo: GeneratedVideo = {
        id: 'vid_' + Date.now(),
        url: data.videoUrl || data.videoUri,
        sceneTitle: selectedScene.title,
        aspectRatio,
        duration,
        timestamp: new Date().toLocaleTimeString(),
      };

      setActiveVideo(newVideo);
      setVideoHistory((prev) => [newVideo, ...prev]);
      setGenerationProgress('Video rendered successfully!');
    } catch (err: any) {
      console.error('Video generation error:', err);
      setErrorMessage(err.message || 'An error occurred during video rendering');
    } finally {
      clearInterval(timer);
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-500 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <Film className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
                <span>3D Kids' Video Generator</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 uppercase">
                  gemini-omni-1.1-flash
                </span>
              </h2>
              <p className="text-xs text-purple-100 font-medium">
                Generate high-quality 3D animated musical nursery rhyme scenes via the Interactions API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Video Player (if generated) */}
          {activeVideo && (
            <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-300">Generated Video: {activeVideo.sceneTitle}</span>
                  <span className="text-xs text-slate-400">({activeVideo.aspectRatio}, {activeVideo.duration})</span>
                </div>
                <a
                  href={activeVideo.url}
                  download={`nursery-rhyme-${activeVideo.id}.mp4`}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4</span>
                </a>
              </div>

              <div className="relative flex justify-center bg-black rounded-xl overflow-hidden max-h-80">
                <video
                  src={activeVideo.url}
                  controls
                  autoPlay
                  loop
                  className={`max-h-80 rounded-xl object-contain ${
                    activeVideo.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Scene Selector */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase text-slate-600 tracking-wider">
                1. Select Scene to Animate
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                {scenes.map((sc) => {
                  const isSelected = selectedSceneId === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => handleSelectScene(sc.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {sc.id}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-900 truncate">{sc.title}</div>
                        <div className="text-[11px] text-slate-500 font-medium truncate">{sc.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Aspect Ratio & Duration */}
            <div className="space-y-4">
              {/* Aspect Ratio Toggle (Required 16:9 or 9:16) */}
              <div>
                <label className="text-xs font-extrabold uppercase text-slate-600 tracking-wider block mb-2">
                  2. Video Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border-2 font-bold text-xs transition-all ${
                      aspectRatio === '16:9'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Tv className="w-5 h-5 text-purple-600" />
                    <div className="text-left">
                      <div className="font-extrabold">16:9 Landscape</div>
                      <div className="text-[10px] text-slate-400">Widescreen / YouTube</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border-2 font-bold text-xs transition-all ${
                      aspectRatio === '9:16'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <div className="text-left">
                      <div className="font-extrabold">9:16 Portrait</div>
                      <div className="text-[10px] text-slate-400">Shorts / TikTok / Reels</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Duration and Resolution */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Clip Duration</label>
                  <div className="flex bg-slate-100 rounded-xl p-1 text-xs font-bold">
                    {(['5s', '10s'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`flex-1 py-1.5 rounded-lg transition-colors ${
                          duration === d ? 'bg-white shadow text-purple-700 font-extrabold' : 'text-slate-600'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Resolution</label>
                  <div className="flex bg-slate-100 rounded-xl p-1 text-xs font-bold">
                    {(['720p', '1080p'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setResolution(r)}
                        className={`flex-1 py-1.5 rounded-lg transition-colors ${
                          resolution === r ? 'bg-white shadow text-purple-700 font-extrabold' : 'text-slate-600'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Character Consistency & Visual Spec Badge */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-amber-950 text-xs">
            <div className="font-extrabold text-amber-900 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Prompt Character Consistency Enforced</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-amber-900 font-medium">
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                <strong>Leo:</strong> Overalls, dark hair, sneakers
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                <strong>Lily:</strong> Blonde pigtails, rainbow shirt
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                <strong>Baby Pip:</strong> Turquoise romper, orange curls
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                <strong>Mom:</strong> Pastel yellow outfit
              </div>
            </div>
          </div>

          {/* Prompt Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase text-slate-600 tracking-wider">
                3. Video Generation Prompt
              </label>
              <button
                onClick={() => setCustomPrompt(selectedScene.videoPrompt)}
                className="text-xs text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-slate-800 leading-relaxed bg-slate-50 focus:bg-white resize-none"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold">Generation Notice:</div>
                <p>{errorMessage}</p>
                <p className="text-[11px] text-rose-600">
                  Note: <code>gemini-omni-1.1-flash</code> requires a valid Google AI Studio API key with access to the video generation model.
                </p>
              </div>
            </div>
          )}

          {/* Generation Progress Indicator */}
          {isGenerating && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-sm text-purple-950 flex items-center justify-between">
                  <span>Generating Video with Gemini Omni Flash...</span>
                  <span className="font-mono text-xs flex items-center gap-1 text-purple-700">
                    <Clock className="w-3.5 h-3.5" />
                    {elapsedSeconds}s
                  </span>
                </div>
                <p className="text-purple-700 text-xs mt-0.5">{generationProgress}</p>
              </div>
            </div>
          )}

          {/* History Gallery */}
          {videoHistory.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Clips</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {videoHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveVideo(item)}
                    className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 text-purple-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-slate-800">{item.sceneTitle}</div>
                      <div className="text-[10px] text-slate-500">{item.duration} • {item.timestamp}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Powered by Google GenAI Interactions API • Model: <code>gemini-omni-1.1-flash</code>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-lg transition-all active:scale-95 ${
                isGenerating
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-500 hover:from-purple-700 hover:to-rose-600'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rendering Video...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate 3D Video ({duration})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
