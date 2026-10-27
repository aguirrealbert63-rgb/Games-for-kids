import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ThreeCanvas } from './components/ThreeCanvas';
import { CinemaBottomDock } from './components/CinemaBottomDock';
import { KaraokeLyricBar } from './components/KaraokeLyricBar';
import { TopHeader } from './components/TopHeader';
import { VideoStudioModal } from './components/VideoStudioModal';
import { DownloadModal } from './components/DownloadModal';
import { MobileInstallModal } from './components/MobileInstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { NurseryAudioEngine } from './audio/nurseryAudioEngine';
import { SCENES_DATA } from './data/scenesData';
import { DanceMove, CameraViewMode, SceneDefinition } from './types/nursery';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(0.85);
  const [cameraViewMode, setCameraViewMode] = useState<CameraViewMode>('director');
  const [userManualMove, setUserManualMove] = useState<DanceMove | null>(null);
  const [isVideoStudioOpen, setIsVideoStudioOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isMobileInstallModalOpen, setIsMobileInstallModalOpen] = useState(false);
  const [clickedCharacterMessage, setClickedCharacterMessage] = useState<string | null>(null);

  const audioEngineRef = useRef<NurseryAudioEngine | null>(null);
  const totalDuration = 190; // 3 minutes 10 seconds

  // Initialize Web Audio Engine once
  useEffect(() => {
    const engine = new NurseryAudioEngine();
    audioEngineRef.current = engine;
    return () => {
      engine.stop();
    };
  }, []);

  // Determine current active scene based on currentTime
  const currentScene: SceneDefinition = useMemo(() => {
    const found = SCENES_DATA.find((s) => currentTime >= s.startTime && currentTime < s.endTime);
    return found || SCENES_DATA[0];
  }, [currentTime]);

  // Current dance move (either manually overridden by user button or dictated by scene)
  const activeDanceMove: DanceMove = userManualMove || currentScene.primaryMove;

  // Master Clock Timer when playing
  useEffect(() => {
    if (!isPlaying) return;

    let lastTimestamp = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const deltaSec = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      setCurrentTime((prev) => {
        const next = prev + deltaSec * playbackSpeed;
        if (next >= totalDuration) {
          // Loop back to start or celebrate
          triggerConfettiBlast();
          return 0;
        }
        return next;
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, playbackSpeed, totalDuration]);

  // Sync Audio Engine state (play/pause, tempo, volume, spoken cues)
  useEffect(() => {
    const engine = audioEngineRef.current;
    if (!engine) return;

    if (isPlaying) {
      engine.setVolume(volume);
      engine.setTempo(currentScene.tempoBpm * playbackSpeed);
      engine.start();

      // Speak instruction cue at scene transition
      if (currentScene.instructions) {
        engine.speakInstruction(currentScene.instructions);
      }
    } else {
      engine.stop();
    }
  }, [isPlaying, currentScene.id, playbackSpeed, volume]);

  // Confetti Blast Helper
  const triggerConfettiBlast = () => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#f43f5e', '#3b82f6', '#facc15', '#10b981', '#a855f7', '#ec4899'],
    });
  };

  // Scene 7 Grand Finale special confetti trigger
  useEffect(() => {
    if (currentScene.id === 7 && isPlaying) {
      triggerConfettiBlast();
      audioEngineRef.current?.playFreezeCrash();
    }
  }, [currentScene.id, isPlaying]);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentProgressPercent = Math.min(
    100,
    ((currentTime - currentScene.startTime) / (currentScene.endTime - currentScene.startTime)) * 100
  );

  // Character Click Reaction
  const handleCharacterClick = (name: string) => {
    audioEngineRef.current?.playGiggle();
    setClickedCharacterMessage(`${name} giggles! "Hehehe!"`);
    setTimeout(() => {
      setClickedCharacterMessage(null);
    }, 2800);
  };

  const handleSelectMove = (move: DanceMove) => {
    setUserManualMove(move);
    if (!isPlaying) {
      setIsPlaying(true);
    }
    if (move === 'jumping' || move === 'hopping') {
      audioEngineRef.current?.playBoing();
    } else if (move === 'freeze') {
      audioEngineRef.current?.playFreezeCrash();
    } else if (move === 'celebrate') {
      triggerConfettiBlast();
    }
  };

  const handleSelectScene = (scene: SceneDefinition) => {
    setCurrentTime(scene.startTime);
    setUserManualMove(null);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-emerald-100 select-none">
      {/* 3D WebGL Canvas Layer */}
      <ThreeCanvas
        currentMove={activeDanceMove}
        cameraPreset={currentScene.cameraPreset}
        cameraViewMode={cameraViewMode}
        playbackSpeed={playbackSpeed}
        isPlaying={isPlaying}
        onCharacterClick={handleCharacterClick}
      />

      {/* Top Header Overlay */}
      <TopHeader
        currentSceneNumber={currentScene.id}
        currentSceneTitle={currentScene.subtitle}
        onOpenVideoStudio={() => setIsVideoStudioOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenMobileInstallModal={() => setIsMobileInstallModalOpen(true)}
        clickedCharacterMessage={clickedCharacterMessage}
      />

      {/* Center-Top Karaoke Lyrics Bar */}
      <div className="fixed top-24 left-0 right-0 z-30 pointer-events-none">
        <KaraokeLyricBar
          sceneTitle={currentScene.title}
          lyrics={currentScene.lyrics}
          instructions={currentScene.instructions}
          currentTimeFormatted={formatTime(currentTime)}
          durationFormatted={formatTime(totalDuration)}
          progressPercent={currentProgressPercent}
        />
      </div>

      {/* Collapsible Unified Bottom Control Dock */}
      <CinemaBottomDock
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onReset={() => {
          setCurrentTime(0);
          setUserManualMove(null);
        }}
        currentTime={currentTime}
        totalDuration={totalDuration}
        onSeek={(t) => setCurrentTime(t)}
        currentMove={activeDanceMove}
        onSelectMove={handleSelectMove}
        currentScene={currentScene}
        allScenes={SCENES_DATA}
        onSelectScene={handleSelectScene}
        cameraViewMode={cameraViewMode}
        onChangeCamera={(cam) => setCameraViewMode(cam)}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={(spd) => setPlaybackSpeed(spd)}
        volume={volume}
        onChangeVolume={(v) => {
          setVolume(v);
          audioEngineRef.current?.setVolume(v);
        }}
        onTriggerConfetti={triggerConfettiBlast}
        onTriggerBubbles={() => {
          audioEngineRef.current?.playBoing();
        }}
        onOpenVideoStudio={() => setIsVideoStudioOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenMobileInstallModal={() => setIsMobileInstallModalOpen(true)}
      />

      {/* Video Generation Studio Modal (Gemini Omni Flash) */}
      <VideoStudioModal
        isOpen={isVideoStudioOpen}
        onClose={() => setIsVideoStudioOpen(false)}
        scenes={SCENES_DATA}
        currentSceneId={currentScene.id}
      />

      {/* Download Project Files Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        scenes={SCENES_DATA}
      />

      {/* Mobile App Install Modal (iOS & Android) */}
      <MobileInstallModal
        isOpen={isMobileInstallModalOpen}
        onClose={() => setIsMobileInstallModalOpen(false)}
      />

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}
