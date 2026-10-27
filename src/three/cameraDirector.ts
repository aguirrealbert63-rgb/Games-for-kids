import * as THREE from 'three';
import { CameraViewMode } from '../types/nursery';

export interface CameraPreset {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov?: number;
}

export class CameraDirector {
  public camera: THREE.PerspectiveCamera;
  public currentTarget = new THREE.Vector3(0, 1.2, 0);
  public currentPosition = new THREE.Vector3(0, 3.2, 8.5);

  public desiredPosition = new THREE.Vector3(0, 3.2, 8.5);
  public desiredTarget = new THREE.Vector3(0, 1.2, 0);
  public viewMode: CameraViewMode = 'director';

  private directorAngle = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 100);
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
  }

  public setViewMode(mode: CameraViewMode) {
    this.viewMode = mode;
  }

  public applyScenePreset(preset: string) {
    if (this.viewMode !== 'director') return;

    switch (preset) {
      case 'intro':
        // Gliding establishing shot across backyard
        this.desiredPosition.set(4.5, 3.8, 8.5);
        this.desiredTarget.set(0, 1.0, 0);
        break;
      case 'wide':
        // Wide full-body synchronized dance shot
        this.desiredPosition.set(0, 2.8, 8.0);
        this.desiredTarget.set(0, 1.0, 0);
        break;
      case 'medium':
        // Medium close dance action shot
        this.desiredPosition.set(-1.8, 2.2, 5.5);
        this.desiredTarget.set(0, 0.9, 0);
        break;
      case 'close_boy':
        // Close-up on Toddler Boy
        this.desiredPosition.set(-1.4, 1.5, 3.2);
        this.desiredTarget.set(-1.2, 1.0, 0.5);
        break;
      case 'close_girl':
        // Close-up on Little Girl
        this.desiredPosition.set(1.4, 1.5, 3.2);
        this.desiredTarget.set(1.2, 1.0, 0.5);
        break;
      case 'close_baby':
        // Close-up on Baby Pip
        this.desiredPosition.set(0, 1.1, 2.6);
        this.desiredTarget.set(0, 0.65, 0.8);
        break;
      case 'mom':
        // Focus on Mom demonstrating moves
        this.desiredPosition.set(0, 2.3, 5.2);
        this.desiredTarget.set(0, 1.4, -0.6);
        break;
      case 'train_orbit':
        // Dynamic tracking shot as they march in a train
        this.desiredPosition.set(3.8, 3.2, 5.5);
        this.desiredTarget.set(0, 1.0, 0);
        break;
      case 'finale':
        // Grand celebration wide low angle
        this.desiredPosition.set(0, 2.2, 7.2);
        this.desiredTarget.set(0, 1.2, 0);
        break;
      default:
        this.desiredPosition.set(0, 2.8, 8.0);
        this.desiredTarget.set(0, 1.0, 0);
    }
  }

  public update(time: number, delta: number, characterPositions?: { [key: string]: THREE.Vector3 }) {
    // Mode overrides
    switch (this.viewMode) {
      case 'boy':
        if (characterPositions?.boy) {
          this.desiredPosition.set(
            characterPositions.boy.x,
            characterPositions.boy.y + 1.2,
            characterPositions.boy.z + 2.8
          );
          this.desiredTarget.set(
            characterPositions.boy.x,
            characterPositions.boy.y + 0.9,
            characterPositions.boy.z
          );
        }
        break;
      case 'girl':
        if (characterPositions?.girl) {
          this.desiredPosition.set(
            characterPositions.girl.x,
            characterPositions.girl.y + 1.2,
            characterPositions.girl.z + 2.8
          );
          this.desiredTarget.set(
            characterPositions.girl.x,
            characterPositions.girl.y + 0.9,
            characterPositions.girl.z
          );
        }
        break;
      case 'baby':
        if (characterPositions?.baby) {
          this.desiredPosition.set(
            characterPositions.baby.x,
            characterPositions.baby.y + 0.9,
            characterPositions.baby.z + 2.3
          );
          this.desiredTarget.set(
            characterPositions.baby.x,
            characterPositions.baby.y + 0.6,
            characterPositions.baby.z
          );
        }
        break;
      case 'mom':
        if (characterPositions?.mom) {
          this.desiredPosition.set(
            characterPositions.mom.x,
            characterPositions.mom.y + 1.6,
            characterPositions.mom.z + 3.8
          );
          this.desiredTarget.set(
            characterPositions.mom.x,
            characterPositions.mom.y + 1.3,
            characterPositions.mom.z
          );
        }
        break;
      case 'overhead':
        this.desiredPosition.set(0, 9.5, 0.1);
        this.desiredTarget.set(0, 0, 0);
        break;
      case 'orbit':
        // Soft continuous orbit around playground
        this.directorAngle += delta * 0.15;
        this.desiredPosition.set(
          Math.sin(this.directorAngle) * 8.2,
          3.2,
          Math.cos(this.directorAngle) * 8.2
        );
        this.desiredTarget.set(0, 1.1, 0);
        break;
      case 'director':
      default:
        // Subtle organic breathing camera float
        const subtleSwayX = Math.sin(time * 0.4) * 0.15;
        const subtleSwayY = Math.cos(time * 0.5) * 0.1;
        this.currentPosition.x += subtleSwayX * delta;
        this.currentPosition.y += subtleSwayY * delta;
        break;
    }

    // Frame-rate independent exponential damping (as required by Three.js skill)
    const lambda = 4.5;
    this.currentPosition.x = THREE.MathUtils.damp(this.currentPosition.x, this.desiredPosition.x, lambda, delta);
    this.currentPosition.y = THREE.MathUtils.damp(this.currentPosition.y, this.desiredPosition.y, lambda, delta);
    this.currentPosition.z = THREE.MathUtils.damp(this.currentPosition.z, this.desiredPosition.z, lambda, delta);

    this.currentTarget.x = THREE.MathUtils.damp(this.currentTarget.x, this.desiredTarget.x, lambda, delta);
    this.currentTarget.y = THREE.MathUtils.damp(this.currentTarget.y, this.desiredTarget.y, lambda, delta);
    this.currentTarget.z = THREE.MathUtils.damp(this.currentTarget.z, this.desiredTarget.z, lambda, delta);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
  }
}
