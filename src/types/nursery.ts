export type DanceMove =
  | 'idle_wave'
  | 'walking'
  | 'hopping'
  | 'running'
  | 'tiptoe'
  | 'skipping'
  | 'jumping'
  | 'freeze'
  | 'train'
  | 'celebrate';

export interface SceneDefinition {
  id: number;
  title: string;
  subtitle: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  primaryMove: DanceMove;
  tempoBpm: number;
  cameraPreset: 'intro' | 'wide' | 'medium' | 'close_boy' | 'close_girl' | 'close_baby' | 'mom' | 'train_orbit' | 'finale';
  lyrics: string;
  instructions: string;
  videoPrompt: string;
}

export type CameraViewMode = 'director' | 'orbit' | 'boy' | 'girl' | 'baby' | 'mom' | 'overhead';

export interface CharacterRef {
  id: string;
  name: string;
  role: string;
  group: any;
  update: (time: number, delta: number, move: DanceMove, speed: number) => void;
  playReaction: () => void;
}
