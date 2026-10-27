import * as THREE from 'three';
import { DanceMove } from '../types/nursery';

export interface CharacterRig {
  id: string;
  name: string;
  role: string;
  group: THREE.Group;
  basePosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  targetRotationY: number;
  joints: {
    root: THREE.Group;
    torso: THREE.Group;
    head: THREE.Group;
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    leftFoot: THREE.Mesh;
    rightFoot: THREE.Mesh;
    hairPigtailL?: THREE.Group;
    hairPigtailR?: THREE.Group;
  };
  update: (time: number, delta: number, move: DanceMove, speed: number, trainAngle?: number) => void;
  triggerGiggle: () => void;
}

// Helper to create glossy cartoon eyes
function createCartoonEye(pupilColor: number, size: number = 0.15): THREE.Group {
  const eyeGroup = new THREE.Group();

  // Eyeball white
  const scleraGeo = new THREE.SphereGeometry(size, 16, 16);
  const scleraMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.05,
  });
  const sclera = new THREE.Mesh(scleraGeo, scleraMat);
  sclera.scale.set(1, 1.1, 0.45);
  eyeGroup.add(sclera);

  // Iris
  const irisGeo = new THREE.CircleGeometry(size * 0.75, 24);
  const irisMat = new THREE.MeshStandardMaterial({
    color: pupilColor,
    roughness: 0.2,
  });
  const iris = new THREE.Mesh(irisGeo, irisMat);
  iris.position.set(0, 0, size * 0.44);
  eyeGroup.add(iris);

  // Pupil (dark center)
  const pupilGeo = new THREE.CircleGeometry(size * 0.45, 16);
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111118 });
  const pupil = new THREE.Mesh(pupilGeo, pupilMat);
  pupil.position.set(0, 0, size * 0.45);
  eyeGroup.add(pupil);

  // Large sparkling catchlight (sparkle)
  const glintGeo = new THREE.CircleGeometry(size * 0.22, 12);
  const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const glint = new THREE.Mesh(glintGeo, glintMat);
  glint.position.set(size * 0.2, size * 0.2, size * 0.46);
  eyeGroup.add(glint);

  // Smaller secondary sparkle
  const glint2Geo = new THREE.CircleGeometry(size * 0.1, 10);
  const glint2 = new THREE.Mesh(glint2Geo, glintMat);
  glint2.position.set(-size * 0.15, -size * 0.15, size * 0.46);
  eyeGroup.add(glint2);

  return eyeGroup;
}

// Cheerful Rosy Cheek
function createCheekBlush(color: number = 0xff8fa3, radius: number = 0.12): THREE.Mesh {
  const geo = new THREE.CircleGeometry(radius, 16);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9,
    transparent: true,
    opacity: 0.65,
  });
  const blush = new THREE.Mesh(geo, mat);
  return blush;
}

// 1. TODDLER BOY ("Toby"): Fluffy dark hair, big brown eyes, blue overalls, colorful sneakers
export function createToddlerBoy(startPos: THREE.Vector3): CharacterRig {
  const root = new THREE.Group();
  root.position.copy(startPos);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.65 });
  const darkHairMat = new THREE.MeshStandardMaterial({ color: 0x2b1c14, roughness: 0.85 });
  const overallsMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.75 }); // Royal Blue
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
  const sneakerMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 }); // Red
  const sneakerTrimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const yellowButtonMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.4 });

  // Torso / Body Group
  const torso = new THREE.Group();
  torso.position.y = 0.75;
  root.add(torso);

  // Rounded belly / body (overalls)
  const bodyGeo = new THREE.CapsuleGeometry(0.32, 0.4, 16, 16);
  const bodyMesh = new THREE.Mesh(bodyGeo, overallsMat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  torso.add(bodyMesh);

  // Inner white t-shirt collar
  const shirtCollarGeo = new THREE.CylinderGeometry(0.26, 0.28, 0.12, 16);
  const shirtMesh = new THREE.Mesh(shirtCollarGeo, shirtMat);
  shirtMesh.position.y = 0.28;
  torso.add(shirtMesh);

  // Overalls straps & buttons
  const strapGeo = new THREE.BoxGeometry(0.08, 0.35, 0.04);
  const strapL = new THREE.Mesh(strapGeo, overallsMat);
  strapL.position.set(-0.16, 0.14, 0.3);
  strapL.rotation.z = -0.15;
  torso.add(strapL);

  const strapR = new THREE.Mesh(strapGeo, overallsMat);
  strapR.position.set(0.16, 0.14, 0.3);
  strapR.rotation.z = 0.15;
  torso.add(strapR);

  const btnGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12);
  btnGeo.rotateX(Math.PI / 2);
  const btnL = new THREE.Mesh(btnGeo, yellowButtonMat);
  btnL.position.set(-0.16, 0.08, 0.32);
  torso.add(btnL);

  const btnR = new THREE.Mesh(btnGeo, yellowButtonMat);
  btnR.position.set(0.16, 0.08, 0.32);
  torso.add(btnR);

  // Head Group
  const head = new THREE.Group();
  head.position.y = 0.52;
  torso.add(head);

  // Big cute toddler head
  const headGeo = new THREE.SphereGeometry(0.38, 24, 24);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Big brown sparkling eyes
  const eyeL = createCartoonEye(0x5c3317, 0.12);
  eyeL.position.set(-0.16, 0.04, 0.32);
  head.add(eyeL);

  const eyeR = createCartoonEye(0x5c3317, 0.12);
  eyeR.position.set(0.16, 0.04, 0.32);
  head.add(eyeR);

  // Rosy cheeks
  const cheekL = createCheekBlush(0xff99a8, 0.08);
  cheekL.position.set(-0.25, -0.07, 0.3);
  cheekL.rotation.y = -0.3;
  head.add(cheekL);

  const cheekR = createCheekBlush(0xff99a8, 0.08);
  cheekR.position.set(0.25, -0.07, 0.3);
  cheekR.rotation.y = 0.3;
  head.add(cheekR);

  // Toddler cute smile
  const smileShape = new THREE.Shape();
  smileShape.absarc(0, 0, 0.08, 0, Math.PI, true);
  const smileGeo = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, -0.12, 0.36),
      new THREE.Vector3(0, -0.16, 0.37),
      new THREE.Vector3(0.08, -0.12, 0.36),
    ]),
    16,
    0.015,
    8,
    false
  );
  const smileMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
  const smileMesh = new THREE.Mesh(smileGeo, smileMat);
  head.add(smileMesh);

  // Fluffy dark cartoon hair (multi-cluster puff)
  const hairGroup = new THREE.Group();
  hairGroup.position.set(0, 0.16, 0);

  const hairMainGeo = new THREE.SphereGeometry(0.41, 16, 16);
  const hairMain = new THREE.Mesh(hairMainGeo, darkHairMat);
  hairMain.position.set(0, 0.08, -0.04);
  hairMain.scale.set(1.02, 0.95, 1.05);
  hairGroup.add(hairMain);

  // Front curls / bangs
  const curlOffsets = [
    [-0.18, 0.22, 0.26, 0.16],
    [-0.06, 0.26, 0.3, 0.18],
    [0.08, 0.25, 0.29, 0.17],
    [0.2, 0.21, 0.25, 0.15],
  ];
  curlOffsets.forEach(([x, y, z, r]) => {
    const curl = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 12), darkHairMat);
    curl.position.set(x, y, z);
    hairGroup.add(curl);
  });
  head.add(hairGroup);

  // Left Arm
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.35, 0.2, 0);
  torso.add(leftArm);

  const armGeo = new THREE.CapsuleGeometry(0.09, 0.28, 12, 12);
  const leftArmMesh = new THREE.Mesh(armGeo, skinMat);
  leftArmMesh.position.y = -0.14;
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);

  // Sleeve
  const sleeveGeo = new THREE.CylinderGeometry(0.11, 0.12, 0.12, 14);
  const sleeveL = new THREE.Mesh(sleeveGeo, shirtMat);
  sleeveL.position.y = -0.04;
  leftArm.add(sleeveL);

  // Right Arm
  const rightArm = new THREE.Group();
  rightArm.position.set(0.35, 0.2, 0);
  torso.add(rightArm);

  const rightArmMesh = new THREE.Mesh(armGeo, skinMat);
  rightArmMesh.position.y = -0.14;
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);

  const sleeveR = new THREE.Mesh(sleeveGeo, shirtMat);
  sleeveR.position.y = -0.04;
  rightArm.add(sleeveR);

  // Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.16, -0.22, 0);
  torso.add(leftLeg);

  const legGeo = new THREE.CapsuleGeometry(0.1, 0.26, 12, 12);
  const leftLegMesh = new THREE.Mesh(legGeo, overallsMat);
  leftLegMesh.position.y = -0.13;
  leftLegMesh.castShadow = true;
  leftLeg.add(leftLegMesh);

  // Left Sneaker
  const shoeGeo = new THREE.BoxGeometry(0.18, 0.12, 0.28);
  const leftFoot = new THREE.Mesh(shoeGeo, sneakerMat);
  leftFoot.position.set(0, -0.3, 0.06);
  leftFoot.castShadow = true;
  leftLeg.add(leftFoot);

  // Sneaker toe cap (white)
  const toeGeo = new THREE.SphereGeometry(0.09, 12, 12);
  const toeL = new THREE.Mesh(toeGeo, sneakerTrimMat);
  toeL.position.set(0, -0.01, 0.12);
  toeL.scale.set(1, 0.65, 0.8);
  leftFoot.add(toeL);

  // Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.16, -0.22, 0);
  torso.add(rightLeg);

  const rightLegMesh = new THREE.Mesh(legGeo, overallsMat);
  rightLegMesh.position.y = -0.13;
  rightLegMesh.castShadow = true;
  rightLeg.add(rightLegMesh);

  const rightFoot = new THREE.Mesh(shoeGeo, sneakerMat);
  rightFoot.position.set(0, -0.3, 0.06);
  rightFoot.castShadow = true;
  rightLeg.add(rightFoot);

  const toeR = new THREE.Mesh(toeGeo, sneakerTrimMat);
  toeR.position.set(0, -0.01, 0.12);
  toeR.scale.set(1, 0.65, 0.8);
  rightFoot.add(toeR);

  let giggleTimer = 0;

  return {
    id: 'boy',
    name: 'Leo (Toddler Boy)',
    role: 'Toddler Boy in Overalls',
    group: root,
    basePosition: startPos.clone(),
    targetPosition: startPos.clone(),
    targetRotationY: 0,
    joints: {
      root,
      torso,
      head,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      leftFoot,
      rightFoot,
    },
    triggerGiggle: () => {
      giggleTimer = 1.5;
    },
    update: (time, delta, move, speed = 1, trainAngle = 0) => {
      animateCharacter({
        time,
        delta,
        move,
        speed,
        trainAngle,
        giggleTimer,
        charIndex: 0,
        torso,
        head,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        root,
        basePos: startPos,
      });
      if (giggleTimer > 0) giggleTimer -= delta;
    },
  };
}

// 2. CUTE LITTLE GIRL ("Lily"): Blonde pigtails, rainbow shirt, purple shorts, pink shoes
export function createLittleGirl(startPos: THREE.Vector3): CharacterRig {
  const root = new THREE.Group();
  root.position.copy(startPos);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.65 });
  const blondeMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.75 }); // Golden blonde
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 }); // Bright pink
  const shortsMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.8 }); // Purple
  const pinkShoeMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 }); // Pink sneakers

  // Procedural Rainbow Canvas Texture for the shirt
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const stripes = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
  const stripeH = 128 / stripes.length;
  stripes.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * stripeH, 128, stripeH);
  });
  const rainbowTex = new THREE.CanvasTexture(canvas);
  rainbowTex.colorSpace = THREE.SRGBColorSpace;
  const rainbowShirtMat = new THREE.MeshStandardMaterial({ map: rainbowTex, roughness: 0.7 });

  // Torso
  const torso = new THREE.Group();
  torso.position.y = 0.72;
  root.add(torso);

  const bodyGeo = new THREE.CapsuleGeometry(0.28, 0.38, 16, 16);
  const bodyMesh = new THREE.Mesh(bodyGeo, rainbowShirtMat);
  bodyMesh.castShadow = true;
  torso.add(bodyMesh);

  // Purple Shorts
  const shortsGeo = new THREE.CylinderGeometry(0.3, 0.31, 0.22, 16);
  const shortsMesh = new THREE.Mesh(shortsGeo, shortsMat);
  shortsMesh.position.y = -0.15;
  torso.add(shortsMesh);

  // Head
  const head = new THREE.Group();
  head.position.y = 0.48;
  torso.add(head);

  const headGeo = new THREE.SphereGeometry(0.36, 24, 24);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Sparkling Blue Eyes
  const eyeL = createCartoonEye(0x0284c7, 0.115);
  eyeL.position.set(-0.15, 0.04, 0.31);
  head.add(eyeL);

  const eyeR = createCartoonEye(0x0284c7, 0.115);
  eyeR.position.set(0.15, 0.04, 0.31);
  head.add(eyeR);

  // Rosy cheeks
  const cheekL = createCheekBlush(0xff70a6, 0.075);
  cheekL.position.set(-0.24, -0.06, 0.28);
  cheekL.rotation.y = -0.3;
  head.add(cheekL);

  const cheekR = createCheekBlush(0xff70a6, 0.075);
  cheekR.position.set(0.24, -0.06, 0.28);
  cheekR.rotation.y = 0.3;
  head.add(cheekR);

  // Cute girl smile
  const smileGeo = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.07, -0.11, 0.34),
      new THREE.Vector3(0, -0.15, 0.35),
      new THREE.Vector3(0.07, -0.11, 0.34),
    ]),
    16,
    0.014,
    8,
    false
  );
  const smileMesh = new THREE.Mesh(smileGeo, new THREE.MeshBasicMaterial({ color: 0x991b1b }));
  head.add(smileMesh);

  // Blonde Hair Base
  const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.39, 16, 16), blondeMat);
  hairBase.position.set(0, 0.06, -0.04);
  hairBase.scale.set(1.02, 1, 1.05);
  head.add(hairBase);

  // Blonde Bangs
  const bangOffsets = [
    [-0.14, 0.24, 0.26, 0.15],
    [-0.03, 0.27, 0.29, 0.17],
    [0.1, 0.25, 0.27, 0.16],
  ];
  bangOffsets.forEach(([x, y, z, r]) => {
    const bang = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 12), blondeMat);
    bang.position.set(x, y, z);
    head.add(bang);
  });

  // Twin Blonde Pigtails with Ribbon Ties!
  const hairPigtailL = new THREE.Group();
  hairPigtailL.position.set(-0.35, 0.18, -0.05);
  head.add(hairPigtailL);

  const ribbonL = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.03, 8, 12), ribbonMat);
  hairPigtailL.add(ribbonL);

  const pigtailGeo = new THREE.ConeGeometry(0.12, 0.38, 12);
  pigtailGeo.rotateZ(0.4);
  const pigtailLMesh = new THREE.Mesh(pigtailGeo, blondeMat);
  pigtailLMesh.position.set(-0.1, -0.15, 0);
  hairPigtailL.add(pigtailLMesh);

  const hairPigtailR = new THREE.Group();
  hairPigtailR.position.set(0.35, 0.18, -0.05);
  head.add(hairPigtailR);

  const ribbonR = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.03, 8, 12), ribbonMat);
  hairPigtailR.add(ribbonR);

  const pigtailRMesh = new THREE.Mesh(pigtailGeo, blondeMat);
  pigtailRMesh.rotation.z = -0.8;
  pigtailRMesh.position.set(0.1, -0.15, 0);
  hairPigtailR.add(pigtailRMesh);

  // Arms
  const armGeo = new THREE.CapsuleGeometry(0.08, 0.26, 12, 12);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.32, 0.18, 0);
  torso.add(leftArm);
  const leftArmMesh = new THREE.Mesh(armGeo, skinMat);
  leftArmMesh.position.y = -0.13;
  leftArm.add(leftArmMesh);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.32, 0.18, 0);
  torso.add(rightArm);
  const rightArmMesh = new THREE.Mesh(armGeo, skinMat);
  rightArmMesh.position.y = -0.13;
  rightArm.add(rightArmMesh);

  // Legs & Pink Shoes
  const legGeo = new THREE.CapsuleGeometry(0.09, 0.24, 12, 12);
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.14, -0.22, 0);
  torso.add(leftLeg);
  const leftLegMesh = new THREE.Mesh(legGeo, skinMat);
  leftLegMesh.position.y = -0.12;
  leftLeg.add(leftLegMesh);

  const shoeGeo = new THREE.BoxGeometry(0.16, 0.11, 0.25);
  const leftFoot = new THREE.Mesh(shoeGeo, pinkShoeMat);
  leftFoot.position.set(0, -0.26, 0.05);
  leftLeg.add(leftFoot);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.14, -0.22, 0);
  torso.add(rightLeg);
  const rightLegMesh = new THREE.Mesh(legGeo, skinMat);
  rightLegMesh.position.y = -0.12;
  rightLeg.add(rightLegMesh);

  const rightFoot = new THREE.Mesh(shoeGeo, pinkShoeMat);
  rightFoot.position.set(0, -0.26, 0.05);
  rightLeg.add(rightFoot);

  let giggleTimer = 0;

  return {
    id: 'girl',
    name: 'Lily (Little Girl)',
    role: 'Girl with Blonde Pigtails & Rainbow Shirt',
    group: root,
    basePosition: startPos.clone(),
    targetPosition: startPos.clone(),
    targetRotationY: 0,
    joints: {
      root,
      torso,
      head,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      leftFoot,
      rightFoot,
      hairPigtailL,
      hairPigtailR,
    },
    triggerGiggle: () => {
      giggleTimer = 1.5;
    },
    update: (time, delta, move, speed = 1, trainAngle = 0) => {
      animateCharacter({
        time,
        delta,
        move,
        speed,
        trainAngle,
        giggleTimer,
        charIndex: 1,
        torso,
        head,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        root,
        basePos: startPos,
        hairPigtailL,
        hairPigtailR,
      });
      if (giggleTimer > 0) giggleTimer -= delta;
    },
  };
}

// 3. ADORABLE BABY ("Baby Pip"): Curly orange hair, oversized blue eyes, turquoise romper, tiny shoes
export function createBaby(startPos: THREE.Vector3): CharacterRig {
  const root = new THREE.Group();
  root.position.copy(startPos);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffe2cf, roughness: 0.65 });
  const orangeHairMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.85 }); // Vibrant orange
  const romperMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.75 }); // Turquoise
  const babyShoeMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 }); // Tiny yellow booties

  // Torso (plump, cute baby proportions)
  const torso = new THREE.Group();
  torso.position.y = 0.55;
  root.add(torso);

  const bodyGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const bodyMesh = new THREE.Mesh(bodyGeo, romperMat);
  bodyMesh.scale.set(1.05, 1.15, 1.1);
  bodyMesh.castShadow = true;
  torso.add(bodyMesh);

  // Cute duck emblem on romper
  const duckEmblemGeo = new THREE.CircleGeometry(0.08, 12);
  const duckMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const duckEmblem = new THREE.Mesh(duckEmblemGeo, duckMat);
  duckEmblem.position.set(0, 0.05, 0.33);
  torso.add(duckEmblem);

  // Head (Chubby baby head with oversized eyes)
  const head = new THREE.Group();
  head.position.y = 0.44;
  torso.add(head);

  const headGeo = new THREE.SphereGeometry(0.34, 24, 24);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.scale.set(1.1, 1.05, 1.05);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Oversized Sparkling Blue Eyes
  const eyeL = createCartoonEye(0x0ea5e9, 0.13);
  eyeL.position.set(-0.15, 0.04, 0.32);
  head.add(eyeL);

  const eyeR = createCartoonEye(0x0ea5e9, 0.13);
  eyeR.position.set(0.15, 0.04, 0.32);
  head.add(eyeR);

  // Chubby baby cheeks
  const cheekL = createCheekBlush(0xfb7185, 0.09);
  cheekL.position.set(-0.25, -0.06, 0.28);
  cheekL.rotation.y = -0.3;
  head.add(cheekL);

  const cheekR = createCheekBlush(0xfb7185, 0.09);
  cheekR.position.set(0.25, -0.06, 0.28);
  cheekR.rotation.y = 0.3;
  head.add(cheekR);

  // Baby open happy mouth
  const mouthGeo = new THREE.CircleGeometry(0.06, 16, 0, Math.PI);
  mouthGeo.rotateZ(Math.PI);
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0xbe123c });
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.position.set(0, -0.12, 0.36);
  head.add(mouth);

  // Curly Orange Hair Tuft on top
  const curlsGroup = new THREE.Group();
  curlsGroup.position.set(0, 0.34, 0.05);
  const curl1 = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.04, 8, 12), orangeHairMat);
  curl1.rotation.x = Math.PI / 3;
  curlsGroup.add(curl1);

  const curl2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), orangeHairMat);
  curl2.position.set(0.06, 0.04, 0.04);
  curlsGroup.add(curl2);

  const curl3 = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), orangeHairMat);
  curl3.position.set(-0.06, 0.03, 0.03);
  curlsGroup.add(curl3);
  head.add(curlsGroup);

  // Baby arms (cute and chubby)
  const armGeo = new THREE.CapsuleGeometry(0.07, 0.2, 10, 10);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.3, 0.12, 0);
  torso.add(leftArm);
  const leftArmMesh = new THREE.Mesh(armGeo, skinMat);
  leftArmMesh.position.y = -0.1;
  leftArm.add(leftArmMesh);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.3, 0.12, 0);
  torso.add(rightArm);
  const rightArmMesh = new THREE.Mesh(armGeo, skinMat);
  rightArmMesh.position.y = -0.1;
  rightArm.add(rightArmMesh);

  // Baby legs & Tiny Booties
  const legGeo = new THREE.CapsuleGeometry(0.08, 0.18, 10, 10);
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.13, -0.18, 0);
  torso.add(leftLeg);
  const leftLegMesh = new THREE.Mesh(legGeo, romperMat);
  leftLegMesh.position.y = -0.09;
  leftLeg.add(leftLegMesh);

  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.2), babyShoeMat);
  leftFoot.position.set(0, -0.2, 0.04);
  leftLeg.add(leftFoot);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.13, -0.18, 0);
  torso.add(rightLeg);
  const rightLegMesh = new THREE.Mesh(legGeo, romperMat);
  rightLegMesh.position.y = -0.09;
  rightLeg.add(rightLegMesh);

  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.2), babyShoeMat);
  rightFoot.position.set(0, -0.2, 0.04);
  rightLeg.add(rightFoot);

  let giggleTimer = 0;

  return {
    id: 'baby',
    name: 'Baby Pip',
    role: 'Adorable Baby in Turquoise Romper',
    group: root,
    basePosition: startPos.clone(),
    targetPosition: startPos.clone(),
    targetRotationY: 0,
    joints: {
      root,
      torso,
      head,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      leftFoot,
      rightFoot,
    },
    triggerGiggle: () => {
      giggleTimer = 1.5;
    },
    update: (time, delta, move, speed = 1, trainAngle = 0) => {
      animateCharacter({
        time,
        delta,
        move,
        speed,
        trainAngle,
        giggleTimer,
        charIndex: 2,
        torso,
        head,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        root,
        basePos: startPos,
      });
      if (giggleTimer > 0) giggleTimer -= delta;
    },
  };
}

// 4. FRIENDLY MOTHER ("Mom"): Pastel yellow outfit, teaches dance moves
export function createMother(startPos: THREE.Vector3): CharacterRig {
  const root = new THREE.Group();
  root.position.copy(startPos);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.65 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.75 }); // Soft chestnut brown
  const yellowDressMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.7 }); // Pastel yellow
  const yellowCardiganMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.65 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 }); // Soft pink flats

  // Torso
  const torso = new THREE.Group();
  torso.position.y = 1.15;
  root.add(torso);

  // Upper Dress
  const bodyGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.55, 16);
  const bodyMesh = new THREE.Mesh(bodyGeo, yellowDressMat);
  bodyMesh.castShadow = true;
  torso.add(bodyMesh);

  // Cardigan / Collar detail
  const cardiganGeo = new THREE.CylinderGeometry(0.26, 0.33, 0.45, 16, 1, true, 0, Math.PI * 1.5);
  const cardiganMesh = new THREE.Mesh(cardiganGeo, yellowCardiganMat);
  cardiganMesh.position.y = 0.05;
  cardiganMesh.rotation.y = Math.PI * 0.75;
  torso.add(cardiganMesh);

  // Pastel Yellow Flared Skirt
  const skirtGeo = new THREE.ConeGeometry(0.52, 0.65, 20, 1, true);
  const skirtMesh = new THREE.Mesh(skirtGeo, yellowDressMat);
  skirtMesh.position.y = -0.45;
  torso.add(skirtMesh);

  // Head
  const head = new THREE.Group();
  head.position.y = 0.52;
  torso.add(head);

  const headGeo = new THREE.SphereGeometry(0.3, 24, 24);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.scale.set(0.95, 1.05, 0.98);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Warm Friendly Green Eyes
  const eyeL = createCartoonEye(0x15803d, 0.11);
  eyeL.position.set(-0.13, 0.05, 0.26);
  head.add(eyeL);

  const eyeR = createCartoonEye(0x15803d, 0.11);
  eyeR.position.set(0.13, 0.05, 0.26);
  head.add(eyeR);

  // Warm blush
  const cheekL = createCheekBlush(0xf472b6, 0.07);
  cheekL.position.set(-0.21, -0.05, 0.23);
  cheekL.rotation.y = -0.3;
  head.add(cheekL);

  const cheekR = createCheekBlush(0xf472b6, 0.07);
  cheekR.position.set(0.21, -0.05, 0.23);
  cheekR.rotation.y = 0.3;
  head.add(cheekR);

  // Beautiful Mother Smile
  const smileGeo = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, -0.11, 0.28),
      new THREE.Vector3(0, -0.15, 0.29),
      new THREE.Vector3(0.08, -0.11, 0.28),
    ]),
    16,
    0.015,
    8,
    false
  );
  head.add(new THREE.Mesh(smileGeo, new THREE.MeshBasicMaterial({ color: 0x991b1b })));

  // Wavy Styled Brown Hair
  const hairGroup = new THREE.Group();
  const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.33, 16, 16), hairMat);
  hairTop.position.set(0, 0.06, -0.04);
  hairGroup.add(hairTop);

  // Side waves framing face
  const waveL = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.32, 10, 10), hairMat);
  waveL.position.set(-0.24, -0.08, 0.06);
  waveL.rotation.z = -0.15;
  hairGroup.add(waveL);

  const waveR = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.32, 10, 10), hairMat);
  waveR.position.set(0.24, -0.08, 0.06);
  waveR.rotation.z = 0.15;
  hairGroup.add(waveR);
  head.add(hairGroup);

  // Arms (longer, graceful for dancing instructions)
  const armGeo = new THREE.CapsuleGeometry(0.07, 0.42, 12, 12);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.35, 0.22, 0);
  torso.add(leftArm);
  const leftArmMesh = new THREE.Mesh(armGeo, yellowCardiganMat);
  leftArmMesh.position.y = -0.22;
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);

  // Hand
  const handGeo = new THREE.SphereGeometry(0.065, 10, 10);
  const handL = new THREE.Mesh(handGeo, skinMat);
  handL.position.y = -0.45;
  leftArm.add(handL);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.35, 0.22, 0);
  torso.add(rightArm);
  const rightArmMesh = new THREE.Mesh(armGeo, yellowCardiganMat);
  rightArmMesh.position.y = -0.22;
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);

  const handR = new THREE.Mesh(handGeo, skinMat);
  handR.position.y = -0.45;
  rightArm.add(handR);

  // Legs & Pink Flats
  const legGeo = new THREE.CapsuleGeometry(0.075, 0.48, 12, 12);
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.14, -0.45, 0);
  torso.add(leftLeg);
  const leftLegMesh = new THREE.Mesh(legGeo, skinMat);
  leftLegMesh.position.y = -0.24;
  leftLeg.add(leftLegMesh);

  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.25), shoeMat);
  leftFoot.position.set(0, -0.5, 0.05);
  leftLeg.add(leftFoot);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.14, -0.45, 0);
  torso.add(rightLeg);
  const rightLegMesh = new THREE.Mesh(legGeo, skinMat);
  rightLegMesh.position.y = -0.24;
  rightLeg.add(rightLegMesh);

  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.25), shoeMat);
  rightFoot.position.set(0, -0.5, 0.05);
  rightLeg.add(rightFoot);

  let giggleTimer = 0;

  return {
    id: 'mom',
    name: 'Mom (Dance Teacher)',
    role: 'Mother in Pastel Yellow Outfit',
    group: root,
    basePosition: startPos.clone(),
    targetPosition: startPos.clone(),
    targetRotationY: 0,
    joints: {
      root,
      torso,
      head,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      leftFoot,
      rightFoot,
    },
    triggerGiggle: () => {
      giggleTimer = 1.5;
    },
    update: (time, delta, move, speed = 1, trainAngle = 0) => {
      animateCharacter({
        time,
        delta,
        move,
        speed,
        trainAngle,
        giggleTimer,
        charIndex: 3,
        torso,
        head,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        root,
        basePos: startPos,
        isMom: true,
      });
      if (giggleTimer > 0) giggleTimer -= delta;
    },
  };
}

// Universal choreographic physics and kinematics solver
interface AnimateParams {
  time: number;
  delta: number;
  move: DanceMove;
  speed: number;
  trainAngle?: number;
  giggleTimer: number;
  charIndex: number;
  torso: THREE.Group;
  head: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  root: THREE.Group;
  basePos: THREE.Vector3;
  hairPigtailL?: THREE.Group;
  hairPigtailR?: THREE.Group;
  isMom?: boolean;
}

function animateCharacter(p: AnimateParams) {
  const {
    time,
    move,
    speed,
    giggleTimer,
    charIndex,
    torso,
    head,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    root,
    basePos,
    hairPigtailL,
    hairPigtailR,
    isMom,
  } = p;

  const t = time * speed * Math.PI * 2;
  const phase = charIndex * 0.35;

  // Reset base transforms
  torso.position.x = 0;
  torso.rotation.set(0, 0, 0);
  head.rotation.set(0, 0, 0);

  // If giggling from user click
  if (giggleTimer > 0) {
    const giggleWave = Math.sin(time * 24);
    head.rotation.z = giggleWave * 0.2;
    head.rotation.x = Math.abs(giggleWave) * 0.15;
    leftArm.rotation.z = 1.8 + giggleWave * 0.3;
    rightArm.rotation.z = -1.8 - giggleWave * 0.3;
    root.position.y = Math.abs(Math.sin(time * 16)) * 0.2;
    return;
  }

  // Choreography by move
  switch (move) {
    case 'idle_wave': {
      // Gentle rhythmic body sway
      const sway = Math.sin(t * 0.5 + phase);
      torso.position.y = 0.75 + Math.abs(Math.sin(t * 0.5)) * 0.05;
      torso.rotation.z = sway * 0.08;
      head.rotation.z = -sway * 0.06;
      head.rotation.y = Math.sin(t * 0.25) * 0.15;

      // Left arm resting or gesturing
      leftArm.rotation.x = Math.sin(t * 0.5) * 0.15;
      leftArm.rotation.z = 0.25;

      // Right arm waving at audience
      rightArm.rotation.x = 0;
      rightArm.rotation.z = -1.8 + Math.sin(t * 1.5) * 0.35;
      rightArm.rotation.y = Math.cos(t * 1.5) * 0.2;

      // Feet planted
      leftLeg.rotation.set(0, 0, 0);
      rightLeg.rotation.set(0, 0, 0);
      root.position.copy(basePos);
      root.rotation.y = 0;
      break;
    }

    case 'walking': {
      // Alternating foot lift and arm swing
      const walkCycle = Math.sin(t * 1.2 + phase);
      const walkBounce = Math.abs(Math.sin(t * 1.2 * 2 + phase));

      root.position.copy(basePos);
      root.position.y = basePos.y + walkBounce * 0.08;
      root.rotation.y = Math.sin(t * 0.3) * 0.05;

      torso.rotation.y = -walkCycle * 0.15;
      torso.rotation.z = Math.cos(t * 1.2 + phase) * 0.05;
      head.rotation.y = walkCycle * 0.1;

      // Opposite arm-leg pump
      leftArm.rotation.x = walkCycle * 0.75;
      leftArm.rotation.z = 0.2;
      rightArm.rotation.x = -walkCycle * 0.75;
      rightArm.rotation.z = -0.2;

      leftLeg.rotation.x = -walkCycle * 0.65;
      rightLeg.rotation.x = walkCycle * 0.65;
      break;
    }

    case 'hopping': {
      // Both feet hopping off the ground in a bouncy arc
      const hopCycle = (t * 1.4) % (Math.PI * 2);
      const hopHeight = Math.max(0, Math.sin(hopCycle));

      root.position.copy(basePos);
      root.position.y = basePos.y + hopHeight * 0.38;

      torso.rotation.x = (1 - hopHeight) * 0.15; // Crouch on landing
      head.rotation.x = hopHeight * 0.1;

      // Cute bunny paws tucked
      leftArm.rotation.x = 0.8 + hopHeight * 0.3;
      leftArm.rotation.z = 0.3;
      rightArm.rotation.x = 0.8 + hopHeight * 0.3;
      rightArm.rotation.z = -0.3;

      leftLeg.rotation.x = (1 - hopHeight) * 0.2;
      rightLeg.rotation.x = (1 - hopHeight) * 0.2;
      break;
    }

    case 'running': {
      // Fast exaggerated cartoon run in place
      const runCycle = Math.sin(t * 2.2 + phase);
      const runBounce = Math.abs(Math.sin(t * 2.2 * 2 + phase));

      root.position.copy(basePos);
      root.position.y = basePos.y + runBounce * 0.14;

      torso.rotation.x = 0.28; // Forward speed lean
      torso.rotation.y = -runCycle * 0.22;
      head.rotation.x = -0.2; // Keep eyes level forward

      // Pumping arms
      leftArm.rotation.x = runCycle * 1.35;
      leftArm.rotation.z = 0.35;
      rightArm.rotation.x = -runCycle * 1.35;
      rightArm.rotation.z = -0.35;

      leftLeg.rotation.x = -runCycle * 1.1;
      rightLeg.rotation.x = runCycle * 1.1;
      break;
    }

    case 'tiptoe': {
      // Elevated tiptoe walking
      const step = Math.sin(t * 0.8 + phase);
      root.position.copy(basePos);
      root.position.y = basePos.y + 0.12 + Math.abs(Math.sin(t * 0.8 * 2)) * 0.04;

      torso.rotation.y = step * 0.1;
      head.rotation.y = Math.sin(t * 0.4) * 0.2;

      // Arms outstretched delicately for balance
      leftArm.rotation.x = 0;
      leftArm.rotation.z = 1.3 + Math.sin(t * 0.8) * 0.15;
      rightArm.rotation.x = 0;
      rightArm.rotation.z = -1.3 - Math.sin(t * 0.8) * 0.15;

      leftLeg.rotation.x = -step * 0.45;
      rightLeg.rotation.x = step * 0.45;
      break;
    }

    case 'skipping': {
      // Rhythmic skip (step-hop)
      const skipCycle = (t * 1.3 + phase) % (Math.PI * 2);
      const skipHop = Math.max(0, Math.sin(skipCycle));
      const skipSide = Math.sin(t * 0.65 + phase);

      root.position.copy(basePos);
      root.position.y = basePos.y + skipHop * 0.32;
      root.rotation.y = skipSide * 0.25;

      torso.rotation.z = skipSide * 0.12;

      leftArm.rotation.x = Math.sin(t * 1.3) * 0.9;
      leftArm.rotation.z = 0.4;
      rightArm.rotation.x = -Math.sin(t * 1.3) * 0.9;
      rightArm.rotation.z = -0.4;

      leftLeg.rotation.x = -Math.sin(t * 1.3) * 0.8;
      rightLeg.rotation.x = Math.sin(t * 1.3) * 0.8;
      break;
    }

    case 'jumping': {
      // Big explosive jump
      const jumpWave = Math.sin(t * 0.9);
      const isUp = jumpWave > 0;
      const jumpHeight = isUp ? jumpWave * 0.55 : 0;
      const crouch = !isUp ? Math.abs(jumpWave) * 0.2 : 0;

      root.position.copy(basePos);
      root.position.y = basePos.y + jumpHeight - crouch;

      if (isUp) {
        // High arms celebration
        leftArm.rotation.z = 2.4;
        rightArm.rotation.z = -2.4;
        leftLeg.rotation.x = 0.2;
        rightLeg.rotation.x = 0.2;
        torso.rotation.x = -0.1;
      } else {
        // Anticipation crouch
        leftArm.rotation.z = 0.3;
        rightArm.rotation.z = -0.3;
        leftArm.rotation.x = 0.5;
        rightArm.rotation.x = 0.5;
        torso.rotation.x = 0.3;
        leftLeg.rotation.x = -0.35;
        rightLeg.rotation.x = -0.35;
      }
      break;
    }

    case 'freeze': {
      // Funny statue pose!
      root.position.copy(basePos);
      if (charIndex === 0) {
        // Boy statue: one leg lifted, hand on forehead
        root.position.y = basePos.y + 0.08;
        head.rotation.set(0.2, 0.3, -0.2);
        leftArm.rotation.set(-0.3, 0, 1.8);
        rightArm.rotation.set(0.8, 0.4, -1.2);
        leftLeg.rotation.set(-0.6, 0, 0.2);
        rightLeg.rotation.set(0, 0, 0);
      } else if (charIndex === 1) {
        // Girl statue: airplane arms and head tilt
        head.rotation.set(-0.15, -0.25, 0.3);
        leftArm.rotation.set(0, 0, 1.6);
        rightArm.rotation.set(0, 0, -1.6);
        leftLeg.rotation.set(0.1, 0, 0);
        rightLeg.rotation.set(-0.4, 0, 0);
      } else if (charIndex === 2) {
        // Baby statue: both arms straight up, silly smile
        head.rotation.set(-0.3, 0, 0);
        leftArm.rotation.set(0, 0, 2.5);
        rightArm.rotation.set(0, 0, -2.5);
      } else {
        // Mom statue: theatrical dance bow pose
        head.rotation.set(0.15, 0.2, 0);
        leftArm.rotation.set(0.4, 0, 0.8);
        rightArm.rotation.set(-0.2, 0, -1.5);
        torso.rotation.set(0.15, 0.2, 0);
      }
      break;
    }

    case 'train': {
      // Follow the Leader around the circular pink mat!
      // Radius of circular mat = ~2.4 units
      const radius = 2.4;
      // Stagger characters in a train line: Mom lead, then Boy, Girl, Baby
      const trainOffsets = [
        -0.45, // Boy (behind mom)
        -0.9,  // Girl (behind boy)
        -1.35, // Baby (caboose)
        0.0,   // Mom (locomotive leader)
      ];
      const charAngle = (p.trainAngle || (time * 0.6)) + trainOffsets[charIndex];

      const trainX = Math.cos(charAngle) * radius;
      const trainZ = Math.sin(charAngle) * radius;

      root.position.set(trainX, basePos.y + Math.abs(Math.sin(t * 1.5)) * 0.08, trainZ);
      // Face along tangent of circular path
      root.rotation.y = -charAngle - Math.PI / 2;

      // Choo-choo arm chugging motion!
      const chug = Math.sin(t * 1.8);
      leftArm.rotation.x = chug * 0.8;
      leftArm.rotation.z = 0.3;
      rightArm.rotation.x = -chug * 0.8;
      rightArm.rotation.z = -0.3;

      leftLeg.rotation.x = -chug * 0.6;
      rightLeg.rotation.x = chug * 0.6;

      head.rotation.y = Math.sin(t * 0.5) * 0.2;
      break;
    }

    case 'celebrate': {
      // Grand finale dance & celebration!
      const spin = Math.sin(t * 1.1 + phase);
      const hop = Math.abs(Math.sin(t * 1.6 + phase));

      root.position.copy(basePos);
      root.position.y = basePos.y + hop * 0.35;
      root.rotation.y = Math.sin(t * 0.4) * 0.35;

      torso.rotation.z = spin * 0.15;
      head.rotation.y = spin * 0.2;

      // Cheering arms in victory V
      leftArm.rotation.z = 2.1 + Math.sin(t * 2) * 0.25;
      rightArm.rotation.z = -2.1 - Math.sin(t * 2) * 0.25;

      leftLeg.rotation.x = Math.sin(t * 1.6) * 0.4;
      rightLeg.rotation.x = -Math.sin(t * 1.6) * 0.4;
      break;
    }
  }

  // Pigtail physics bounce for Lily
  if (hairPigtailL && hairPigtailR) {
    const pigtailBounce = Math.sin(t * 1.8) * 0.2;
    hairPigtailL.rotation.z = pigtailBounce;
    hairPigtailR.rotation.z = -pigtailBounce;
  }
}
