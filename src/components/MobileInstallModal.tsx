import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Share2,
  PlusSquare,
  Download,
  CheckCircle2,
  Sparkles,
  QrCode,
  Copy,
  Check,
  Apple,
  ExternalLink,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileInstallModal: React.FC<MobileInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    currentUrl
  )}&color=881337&bgcolor=fff1f2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-rose-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
                <span>Install on Mobile Devices</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-300 text-amber-950 uppercase">
                  iOS & Android
                </span>
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Install as a full-screen native mobile app on your iPhone, iPad, or Android device
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

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'android'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-base">🤖</span>
            <span>Android (Chrome & WebAPK)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'ios'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>iOS (iPhone & iPad Safari)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Already Installed Alert */}
          {isInstalled && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="block">App is currently installed!</strong>
                <span>You are running in full standalone app mode on your device.</span>
              </div>
            </div>
          )}

          {/* Android Tab Content */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              {/* Direct 1-Tap Install Button if available */}
              {isInstallable && (
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-emerald-900">Direct 1-Tap Installation</h3>
                    <p className="text-xs text-emerald-700">Install automatically to your Android apps drawer.</p>
                  </div>
                  <button
                    onClick={install}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-transform active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install App</span>
                  </button>
                </div>
              )}

              {/* Step by step Android Instructions */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                  How to Install on Android Phone / Tablet:
                </h4>
                <ol className="space-y-2.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      1
                    </span>
                    <span>
                      Open this page in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your Android device.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      2
                    </span>
                    <span>
                      Tap the <strong>three dots menu (⋮)</strong> in the top-right corner of the browser.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      3
                    </span>
                    <span>
                      Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      4
                    </span>
                    <span>
                      The app icon <strong>"Move & Dance"</strong> will appear on your home screen and launcher, launching in full-screen standalone mode without any browser tabs!
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* iOS Tab Content */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-800">
                  How to Install on iPhone & iPad:
                </h4>
                <ol className="space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      1
                    </span>
                    <span>
                      Open this page in <strong>Safari</strong> on your iPhone or iPad.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      2
                    </span>
                    <div className="flex-1">
                      <span>Tap the <strong>Share</strong> button at the bottom of the Safari screen:</span>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-rose-300 rounded-lg text-rose-700 font-bold ml-2 text-[11px]">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      3
                    </span>
                    <div className="flex-1">
                      <span>Scroll down the share sheet and tap <strong>"Add to Home Screen"</strong>:</span>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-rose-300 rounded-lg text-rose-700 font-bold ml-2 text-[11px]">
                        <PlusSquare className="w-3.5 h-3.5" />
                        <span>Add to Home Screen</span>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      4
                    </span>
                    <span>
                      Tap <strong>"Add"</strong> in the top-right corner. The app will launch with smooth full-screen 3D animation, offline sound, and zero browser bars!
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* QR Code to Open on Phone */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm shrink-0">
              <img
                src={qrCodeUrl}
                alt="QR Code to open on phone"
                className="w-28 h-28 rounded-lg"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black uppercase text-slate-800">
                <QrCode className="w-4 h-4 text-rose-600" />
                <span>Scan with your Phone Camera</span>
              </div>
              <p className="text-xs text-slate-600">
                Point your iPhone or Android camera at this QR code to open the app on your mobile device instantly.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="text-[11px] font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 flex-1 truncate"
                />
                <button
                  onClick={copyUrl}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-colors shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Native Mobile App Benefits */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-extrabold text-slate-800">Fullscreen</div>
              <div className="text-[11px] text-slate-500">No browser address bar</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-extrabold text-slate-800">Touch Controls</div>
              <div className="text-[11px] text-slate-500">Tap characters to giggle</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-extrabold text-slate-800">Offline Music</div>
              <div className="text-[11px] text-slate-500">Plays without internet</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>PWA Compliant • Android WebAPK & iOS Safari</span>
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
