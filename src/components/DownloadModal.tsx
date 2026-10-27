import React, { useState } from 'react';
import {
  X,
  Download,
  FolderArchive,
  FileCode,
  FileText,
  Check,
  Copy,
  Terminal,
  Sparkles,
  Layers,
  Music,
  Video,
} from 'lucide-react';
import { SceneDefinition } from '../types/nursery';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: SceneDefinition[];
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  scenes,
}) => {
  const [copiedCommand, setCopiedCommand] = useState(false);

  if (!isOpen) return null;

  const copySetupInstructions = () => {
    navigator.clipboard.writeText('npm install && npm run dev');
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleDownloadScreenplayJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scenes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'nursery-rhyme-scenes-screenplay.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-emerald-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <FolderArchive className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
                <span>Download Project Files</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 uppercase">
                  Complete Bundle
                </span>
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Everything you need to run, modify, and deploy the 3D nursery rhyme experience
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Main Download Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <FolderArchive className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Full Project Source Archive (.zip)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Includes complete React + Three.js code, procedural 3D characters, backyard playground, Web Audio synthesizer, Express server, and Gemini Omni Flash video endpoints.
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] font-bold text-emerald-700">
                  <span className="bg-emerald-100 px-2 py-0.5 rounded-md">ZIP Archive</span>
                  <span>•</span>
                  <span>Ready to run locally</span>
                </div>
              </div>
            </div>

            <a
              href="/api/download-project"
              download="lets-move-and-dance-3d-project.zip"
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download .ZIP</span>
            </a>
          </div>

          {/* Secondary Download Option: Scenes & Prompts JSON */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">
                  Nursery Screenplay & Video Prompts (.JSON)
                </h4>
                <p className="text-[11px] text-slate-500">
                  The complete 7-scene timeline, choreography moves, lyrics, and Omni Flash video prompts.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadScreenplayJson}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          {/* What's Inside Grid */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              What's Included in the Download
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-700">4 3D Characters</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-slate-700">Backyard World</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <Music className="w-4 h-4 text-rose-500" />
                <span className="font-bold text-slate-700">Audio Engine</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-700">Omni Flash Server</span>
              </div>
            </div>
          </div>

          {/* Local Setup Instructions Box */}
          <div className="bg-slate-900 rounded-2xl p-4 text-white text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-200">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Quick Local Run</span>
              </div>
              <button
                onClick={copySetupInstructions}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                {copiedCommand ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCommand ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="font-mono bg-black/60 p-2.5 rounded-lg text-emerald-300 text-xs border border-slate-800">
              unzip lets-move-and-dance-3d-project.zip<br />
              npm install<br />
              npm run dev
            </div>
            <p className="text-[11px] text-slate-400">
              The project runs on <code>http://localhost:3000</code> with full 3D interactive animation and Express video API.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Format: Standard .zip archive</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
