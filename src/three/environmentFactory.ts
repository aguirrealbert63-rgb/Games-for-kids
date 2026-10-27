import * as THREE from 'three';

export interface EnvironmentObjects {
  group: THREE.Group;
  bubbles: THREE.InstancedMesh;
  bubbleCount: number;
  bubbleData: Array<{ x: number; y: number; z: number; speed: number; seed: number; size: number }>;
  starsMesh?: THREE.InstancedMesh;
  update: (time: number, delta: number) => void;
  triggerBurst: (x?: number, y?: number, z?: number) => void;
}

export function createBackyardEnvironment(): EnvironmentObjects {
  const group = new THREE.Group();

  // 1. Lush Green Playground Grass Terrain
  const groundGeo = new THREE.PlaneGeometry(60, 60, 32, 32);
  groundGeo.rotateX(-Math.PI / 2);

  // Procedural grass texture with subtle color mottling
  const grassCanvas = document.createElement('canvas');
  grassCanvas.width = 512;
  grassCanvas.height = 512;
  const gCtx = grassCanvas.getContext('2d')!;
  gCtx.fillStyle = '#65a30d'; // Bright spring green
  gCtx.fillRect(0, 0, 512, 512);

  // Add playful clover & grass specks
  for (let i = 0; i < 400; i++) {
    const gx = Math.random() * 512;
    const gy = Math.random() * 512;
    const gr = Math.random() * 3 + 1;
    gCtx.fillStyle = i % 2 === 0 ? '#84cc16' : '#4d7c0f';
    gCtx.beginPath();
    gCtx.arc(gx, gy, gr, 0, Math.PI * 2);
    gCtx.fill();
  }
  const grassTexture = new THREE.CanvasTexture(grassCanvas);
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(12, 12);
  grassTexture.colorSpace = THREE.SRGBColorSpace;

  const groundMat = new THREE.MeshStandardMaterial({
    map: grassTexture,
    roughness: 0.85,
    metalness: 0.05,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true;
  group.add(ground);

  // 2. Large Pink Circular Dancing Mat (Centerpiece!)
  const matRadius = 3.6;
  const matGeo = new THREE.CylinderGeometry(matRadius, matRadius, 0.05, 48);

  // Procedural Dancing Mat Canvas: Concentric Pastel Rings, Stars, and Cute Dots
  const matCanvas = document.createElement('canvas');
  matCanvas.width = 1024;
  matCanvas.height = 1024;
  const mCtx = matCanvas.getContext('2d')!;
  const cx = 512;
  const cy = 512;

  // Outer rim: Bright Strawberry Pink
  mCtx.fillStyle = '#f43f5e';
  mCtx.beginPath();
  mCtx.arc(cx, cy, 500, 0, Math.PI * 2);
  mCtx.fill();

  // Next ring: Soft Cotton Candy Pink
  mCtx.fillStyle = '#fda4af';
  mCtx.beginPath();
  mCtx.arc(cx, cy, 460, 0, Math.PI * 2);
  mCtx.fill();

  // Next ring: Pastel Cream / Yellow
  mCtx.fillStyle = '#fef08a';
  mCtx.beginPath();
  mCtx.arc(cx, cy, 390, 0, Math.PI * 2);
  mCtx.fill();

  // Center disk: Vibrant Rose Pink
  mCtx.fillStyle = '#fb7185';
  mCtx.beginPath();
  mCtx.arc(cx, cy, 320, 0, Math.PI * 2);
  mCtx.fill();

  // Inner ring: Soft Lavender
  mCtx.fillStyle = '#e9d5ff';
  mCtx.beginPath();
  mCtx.arc(cx, cy, 210, 0, Math.PI * 2);
  mCtx.fill();

  // Center Star
  mCtx.fillStyle = '#facc15'; // Golden star
  drawStar(mCtx, cx, cy, 5, 110, 50);

  // Outer perimeter decorative yellow dance stars
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const sx = cx + Math.cos(angle) * 425;
    const sy = cy + Math.sin(angle) * 425;
    mCtx.fillStyle = '#fef08a';
    drawStar(mCtx, sx, sy, 5, 24, 11);
  }

  const matTexture = new THREE.CanvasTexture(matCanvas);
  matTexture.colorSpace = THREE.SRGBColorSpace;

  const matMat = new THREE.MeshStandardMaterial({
    map: matTexture,
    roughness: 0.6,
    metalness: 0.1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const dancingMat = new THREE.Mesh(matGeo, matMat);
  dancingMat.position.y = 0.025;
  dancingMat.receiveShadow = true;
  group.add(dancingMat);

  // 3. Pastel Cottage House in the Background
  const houseGroup = createPastelCottage();
  houseGroup.position.set(0, 0, -11.5);
  group.add(houseGroup);

  // 4. White Picket Fence (Curved border enclosing the backyard)
  const fenceGroup = createWhitePicketFence();
  group.add(fenceGroup);

  // 5. Stylized Puffy Cartoon Trees
  const treePositions = [
    [-9, 0, -8],
    [9, 0, -8],
    [-11, 0, -1],
    [11, 0, -1],
    [-9, 0, 6],
    [9, 0, 6],
    [-5, 0, -12],
    [5, 0, -12],
  ];
  treePositions.forEach(([tx, ty, tz], i) => {
    const tree = createCartoonTree(i);
    tree.position.set(tx, ty, tz);
    group.add(tree);
  });

  // 6. Flowering Bushes with Lilac & Rose clusters
  const bushPositions = [
    [-5.5, 0, -6],
    [5.5, 0, -6],
    [-7, 0, 2],
    [7, 0, 2],
    [-4, 0, 6.5],
    [4, 0, 6.5],
  ];
  bushPositions.forEach(([bx, by, bz], i) => {
    const bush = createFloweringBush(i % 2 === 0 ? 0xf472b6 : 0xc084fc);
    bush.position.set(bx, by, bz);
    group.add(bush);
  });

  // 7. Small Colorful Playground Slide
  const slide = createPlaygroundSlide();
  slide.position.set(6.2, 0, -2.5);
  slide.rotation.y = -Math.PI / 4;
  group.add(slide);

  // 8. Floating Iridescent Soap Bubbles (InstancedMesh)
  const bubbleCount = 45;
  const bubbleGeo = new THREE.SphereGeometry(0.18, 16, 16);
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.85,
    opacity: 0.8,
    transparent: true,
    roughness: 0.1,
    ior: 1.25,
    clearcoat: 1.0,
    attenuationColor: new THREE.Color(0x38bdf8),
    depthWrite: false,
  });

  const bubbles = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
  bubbles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  group.add(bubbles);

  const bubbleData: Array<{ x: number; y: number; z: number; speed: number; seed: number; size: number }> = [];
  const dummy = new THREE.Object3D();

  for (let i = 0; i < bubbleCount; i++) {
    const data = {
      x: (Math.random() - 0.5) * 12,
      y: Math.random() * 5 + 0.3,
      z: (Math.random() - 0.5) * 12,
      speed: Math.random() * 0.4 + 0.25,
      seed: Math.random() * 100,
      size: Math.random() * 0.7 + 0.6,
    };
    bubbleData.push(data);
    dummy.position.set(data.x, data.y, data.z);
    dummy.scale.setScalar(data.size);
    dummy.updateMatrix();
    bubbles.setMatrixAt(i, dummy.matrix);
  }
  bubbles.instanceMatrix.needsUpdate = true;

  // 9. Floating Golden Celebration Stars
  const starCount = 20;
  const starGeo = new THREE.TetrahedronGeometry(0.2, 0);
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xeab308,
    emissiveIntensity: 0.4,
    roughness: 0.3,
    metalness: 0.8,
  });
  const starsMesh = new THREE.InstancedMesh(starGeo, starMat, starCount);
  group.add(starsMesh);

  const starData: Array<{ x: number; y: number; z: number; rotSpeed: number; offset: number }> = [];
  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2;
    const r = matRadius * 1.05;
    starData.push({
      x: Math.cos(angle) * r,
      y: 0.4 + (i % 3) * 0.3,
      z: Math.sin(angle) * r,
      rotSpeed: Math.random() * 2 + 1,
      offset: i * 0.5,
    });
  }

  return {
    group,
    bubbles,
    bubbleCount,
    bubbleData,
    starsMesh,
    update: (time: number, delta: number) => {
      // Animate bubbles floating up with soft sway
      for (let i = 0; i < bubbleCount; i++) {
        const b = bubbleData[i];
        b.y += b.speed * delta;
        b.x += Math.sin(time * 1.5 + b.seed) * 0.008;
        b.z += Math.cos(time * 1.2 + b.seed) * 0.008;

        if (b.y > 6.5) {
          b.y = 0.2;
          b.x = (Math.random() - 0.5) * 11;
          b.z = (Math.random() - 0.5) * 11;
        }

        dummy.position.set(b.x, b.y, b.z);
        const wobble = 1 + Math.sin(time * 3 + b.seed) * 0.06;
        dummy.scale.set(b.size * wobble, b.size / wobble, b.size * wobble);
        dummy.updateMatrix();
        bubbles.setMatrixAt(i, dummy.matrix);
      }
      bubbles.instanceMatrix.needsUpdate = true;

      // Animate dancing mat stars
      if (starsMesh) {
        for (let i = 0; i < starCount; i++) {
          const s = starData[i];
          const hoverY = s.y + Math.sin(time * 2.5 + s.offset) * 0.12;
          dummy.position.set(s.x, hoverY, s.z);
          dummy.rotation.set(time * s.rotSpeed, time * s.rotSpeed * 0.8, 0);
          dummy.scale.setScalar(0.7 + Math.sin(time * 3 + s.offset) * 0.15);
          dummy.updateMatrix();
          starsMesh.setMatrixAt(i, dummy.matrix);
        }
        starsMesh.instanceMatrix.needsUpdate = true;
      }
    },
    triggerBurst: (x = 0, y = 1.5, z = 0) => {
      // Temporarily spawn extra bubbles around position
      for (let i = 0; i < 15; i++) {
        const b = bubbleData[i % bubbleCount];
        b.x = x + (Math.random() - 0.5) * 2;
        b.y = y + Math.random() * 0.8;
        b.z = z + (Math.random() - 0.5) * 2;
        b.speed = Math.random() * 0.8 + 0.5;
      }
    },
  };
}

// Procedural 2D Star Helper
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerR: number, innerR: number) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerR;
    y = cy + Math.sin(rot) * outerR;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerR;
    y = cy + Math.sin(rot) * innerR;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
  ctx.fill();
}

// 3. Pastel Cottage House
function createPastelCottage(): THREE.Group {
  const house = new THREE.Group();

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xede9fe, roughness: 0.85 }); // Soft lavender
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.7 }); // Mint green
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const doorMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 }); // Pastel pink
  const windowMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.2, metalness: 0.3 }); // Sky blue glass

  // Main House Box
  const wallGeo = new THREE.BoxGeometry(8, 4.2, 5.5);
  const walls = new THREE.Mesh(wallGeo, wallMat);
  walls.position.y = 2.1;
  walls.castShadow = true;
  walls.receiveShadow = true;
  house.add(walls);

  // Mint Green Pitched Roof
  const roofGeo = new THREE.ConeGeometry(5.8, 2.6, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 5.4;
  roof.scale.set(1.15, 1, 0.85);
  roof.castShadow = true;
  house.add(roof);

  // Chimney
  const chimneyMat = new THREE.MeshStandardMaterial({ color: 0xfca5a5, roughness: 0.9 });
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.7), chimneyMat);
  chimney.position.set(2.4, 5.6, 0);
  chimney.castShadow = true;
  house.add(chimney);

  // Cute Arched Front Door
  const door = new THREE.Mesh(new THREE.CapsuleGeometry(0.75, 1.3, 12, 12), doorMat);
  door.position.set(0, 1.2, 2.78);
  door.scale.set(1, 1, 0.15);
  house.add(door);

  // Gold Doorknob
  const knob = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.3 })
  );
  knob.position.set(0.42, 1.1, 2.86);
  house.add(knob);

  // Round Windows with White Frames
  [-2.2, 2.2].forEach((wx) => {
    const winGroup = new THREE.Group();
    winGroup.position.set(wx, 2.3, 2.78);

    const winGlass = new THREE.Mesh(new THREE.CircleGeometry(0.65, 24), windowMat);
    winGroup.add(winGlass);

    const frame = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.08, 8, 24), trimMat);
    winGroup.add(frame);

    // Cross mullions
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 0.02), trimMat);
    winGroup.add(crossH);
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.3, 0.02), trimMat);
    winGroup.add(crossV);

    house.add(winGroup);
  });

  return house;
}

// 4. White Picket Fence
function createWhitePicketFence(): THREE.Group {
  const fence = new THREE.Group();
  const picketMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const picketGeo = new THREE.BoxGeometry(0.16, 1.1, 0.05);

  // Picket top triangle
  const tipGeo = new THREE.ConeGeometry(0.12, 0.2, 4);
  tipGeo.rotateY(Math.PI / 4);

  // Single picket assembly
  const singlePicket = new THREE.Group();
  const base = new THREE.Mesh(picketGeo, picketMat);
  base.position.y = 0.55;
  base.castShadow = true;
  singlePicket.add(base);

  const tip = new THREE.Mesh(tipGeo, picketMat);
  tip.position.y = 1.18;
  tip.castShadow = true;
  singlePicket.add(tip);

  // Horizontal rails
  const railMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });

  // Border coordinates (U-shaped fence around backyard)
  const segments = 48;
  const radius = 13.5;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 1.5 - Math.PI * 0.25;
    const px = Math.cos(angle) * radius;
    const pz = Math.sin(angle) * radius * 0.85;

    // Only fence the back and sides, leave front camera open
    if (pz < 5.5) {
      const p = singlePicket.clone();
      p.position.set(px, 0, pz);
      p.rotation.y = -angle + Math.PI / 2;
      fence.add(p);
    }
  }

  return fence;
}

// 5. Stylized Puffy Cartoon Tree (Multi-sphere foliage cluster)
function createCartoonTree(seed: number): THREE.Group {
  const tree = new THREE.Group();

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9 });
  const leavesMat = new THREE.MeshStandardMaterial({
    color: seed % 2 === 0 ? 0x22c55e : 0x16a34a,
    roughness: 0.75,
  });

  // Tapered rounded trunk
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.42, 2.4, 12), trunkMat);
  trunk.position.y = 1.2;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  // Foliage puffy clusters
  const foliage = new THREE.Group();
  foliage.position.y = 2.8;

  const clusterOffsets = [
    [0, 0.4, 0, 1.4],
    [-0.6, 0, 0.3, 1.1],
    [0.6, 0, -0.2, 1.15],
    [0.1, -0.2, 0.7, 1.0],
    [-0.2, 0.8, -0.3, 1.1],
  ];

  clusterOffsets.forEach(([cx, cy, cz, cr]) => {
    const blob = new THREE.Mesh(new THREE.SphereGeometry(cr, 14, 14), leavesMat);
    blob.position.set(cx, cy, cz);
    blob.castShadow = true;
    blob.receiveShadow = true;
    foliage.add(blob);
  });

  tree.add(foliage);
  return tree;
}

// 6. Flowering Bush
function createFloweringBush(flowerColor: number): THREE.Group {
  const bush = new THREE.Group();
  const bushMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.8 });
  const flowerMat = new THREE.MeshStandardMaterial({ color: flowerColor, roughness: 0.5 });

  // Main green mounds
  const mainMound = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 12), bushMat);
  mainMound.position.y = 0.5;
  mainMound.scale.set(1.3, 0.9, 1.1);
  mainMound.castShadow = true;
  bush.add(mainMound);

  // Tiny cute flower blossoms on bush
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const fx = Math.cos(angle) * 0.75;
    const fz = Math.sin(angle) * 0.65;
    const fy = 0.5 + Math.sin(i * 3) * 0.25;

    const flower = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), flowerMat);
    flower.position.set(fx, fy, fz);
    bush.add(flower);
  }

  return bush;
}

// 7. Small Colorful Playground Slide
function createPlaygroundSlide(): THREE.Group {
  const slideGroup = new THREE.Group();

  const yellowChuteMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35, metalness: 0.2 });
  const redLadderMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
  const turquoiseRailMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4 });

  // Curved Slide Chute (CatmullRom Curve extruded or curved box)
  const slideCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.2, 0),
    new THREE.Vector3(0, 1.8, 0.7),
    new THREE.Vector3(0, 0.9, 1.8),
    new THREE.Vector3(0, 0.15, 2.8),
    new THREE.Vector3(0, 0.1, 3.4),
  ]);

  const chuteGeo = new THREE.TubeGeometry(slideCurve, 20, 0.45, 12, false);
  const chute = new THREE.Mesh(chuteGeo, yellowChuteMat);
  chute.scale.set(1.4, 0.5, 1);
  chute.castShadow = true;
  slideGroup.add(chute);

  // Platform at top
  const platform = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 0.9), turquoiseRailMat);
  platform.position.set(0, 2.2, -0.4);
  slideGroup.add(platform);

  // Red Ladder at back
  const ladderPoleGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.3, 10);
  const ladderL = new THREE.Mesh(ladderPoleGeo, redLadderMat);
  ladderL.position.set(-0.45, 1.15, -0.8);
  slideGroup.add(ladderL);

  const ladderR = new THREE.Mesh(ladderPoleGeo, redLadderMat);
  ladderR.position.set(0.45, 1.15, -0.8);
  slideGroup.add(ladderR);

  // Ladder Rungs
  for (let y = 0.4; y < 2.2; y += 0.35) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8), redLadderMat);
    rung.rotation.z = Math.PI / 2;
    rung.position.set(0, y, -0.8);
    slideGroup.add(rung);
  }

  // Safety Handrails
  const railGeo = new THREE.TorusGeometry(0.4, 0.05, 8, 16, Math.PI);
  const railL = new THREE.Mesh(railGeo, turquoiseRailMat);
  railL.rotation.y = Math.PI / 2;
  railL.position.set(-0.5, 2.6, -0.4);
  slideGroup.add(railL);

  const railR = new THREE.Mesh(railGeo, turquoiseRailMat);
  railR.rotation.y = Math.PI / 2;
  railR.position.set(0.5, 2.6, -0.4);
  slideGroup.add(railR);

  return slideGroup;
}
