import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createToddlerBoy, createLittleGirl, createBaby, createMother, CharacterRig } from '../three/characterFactory';
import { createBackyardEnvironment, EnvironmentObjects } from '../three/environmentFactory';
import { CameraDirector } from '../three/cameraDirector';
import { DanceMove, CameraViewMode } from '../types/nursery';

interface ThreeCanvasProps {
  currentMove: DanceMove;
  cameraPreset: string;
  cameraViewMode: CameraViewMode;
  playbackSpeed: number;
  isPlaying: boolean;
  onCharacterClick?: (characterName: string) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  currentMove,
  cameraPreset,
  cameraViewMode,
  playbackSpeed,
  isPlaying,
  onCharacterClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    currentMove,
    cameraPreset,
    cameraViewMode,
    playbackSpeed,
    isPlaying,
  });

  // Keep stateRef up to date without triggering canvas re-initialization
  useEffect(() => {
    stateRef.current = {
      currentMove,
      cameraPreset,
      cameraViewMode,
      playbackSpeed,
      isPlaying,
    };
  }, [currentMove, cameraPreset, cameraViewMode, playbackSpeed, isPlaying]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Scene setup with soft pastel sky fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbbf7d0); // Soft sunny sky pastel
    scene.fog = new THREE.Fog(0xbbf7d0, 16, 42);

    // 3. Renderer configuration
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 4. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Rig
    // Warm sunny key light
    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.8);
    sunLight.position.set(6, 12, 8);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 30;
    sunLight.shadow.camera.left = -8;
    sunLight.shadow.camera.right = 8;
    sunLight.shadow.camera.top = 8;
    sunLight.shadow.camera.bottom = -8;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    // Cool sky / warm ground Hemisphere fill light
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x84cc16, 1.1);
    scene.add(hemiLight);

    // Soft rim backlight
    const rimLight = new THREE.DirectionalLight(0xfff7ed, 0.6);
    rimLight.position.set(-6, 8, -6);
    scene.add(rimLight);

    // 6. Camera Director
    const director = new CameraDirector(width / height);

    // 7. Backyard Environment
    const env: EnvironmentObjects = createBackyardEnvironment();
    scene.add(env.group);

    // 8. The 4 Main Characters placed on the pink dancing mat!
    // Toddler Boy (left front), Little Girl (right front), Baby Pip (center front), Mom (center back teacher)
    const boyRig: CharacterRig = createToddlerBoy(new THREE.Vector3(-1.3, 0.05, 0.5));
    const girlRig: CharacterRig = createLittleGirl(new THREE.Vector3(1.3, 0.05, 0.5));
    const babyRig: CharacterRig = createBaby(new THREE.Vector3(0, 0.05, 1.4));
    const momRig: CharacterRig = createMother(new THREE.Vector3(0, 0.05, -0.9));

    scene.add(boyRig.group);
    scene.add(girlRig.group);
    scene.add(babyRig.group);
    scene.add(momRig.group);

    const characters = [boyRig, girlRig, babyRig, momRig];

    // Raycasting for interactive character giggles on click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, director.camera);
      for (const char of characters) {
        const hits = raycaster.intersectObjects(char.group.children, true);
        if (hits.length > 0) {
          char.triggerGiggle();
          env.triggerBurst(char.group.position.x, char.group.position.y + 1, char.group.position.z);
          if (onCharacterClick) {
            onCharacterClick(char.name);
          }
          break;
        }
      }
    };
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      director.camera.aspect = w / h;
      director.camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId = 0;
    let clock = new THREE.Clock();
    let accumulatedTime = 0;
    let trainAngle = 0;

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const { isPlaying, playbackSpeed, currentMove, cameraPreset, cameraViewMode } = stateRef.current;

      if (isPlaying) {
        accumulatedTime += delta * playbackSpeed;
        trainAngle += delta * 0.7 * playbackSpeed;
      }

      // Update camera director
      director.setViewMode(cameraViewMode);
      director.applyScenePreset(cameraPreset);
      director.update(accumulatedTime, delta, {
        boy: boyRig.group.position,
        girl: girlRig.group.position,
        baby: babyRig.group.position,
        mom: momRig.group.position,
      });

      // Update character rigs with kinematics
      characters.forEach((char) => {
        char.update(accumulatedTime, delta, currentMove, playbackSpeed, trainAngle);
      });

      // Update environment (bubbles drift, stars twinkle)
      env.update(accumulatedTime, delta);

      renderer.render(scene, director.camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full overflow-hidden select-none" />;
};
