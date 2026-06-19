import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Track, TurntableSettings } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface Turntable3DProps {
  activeTrack: Track | null;
  isPlaying: boolean;
  pitch: number;
  speedMode: 33 | 45;
  cueingLeverUp: boolean;
  crackleVolume: number;
  onNeedleDrop: (progress: number) => void;
  onNeedleLift: () => void;
  onSettingsChange: (settings: Partial<TurntableSettings & { isPlaying?: boolean; speedMode?: 33 | 45 }>) => void;
  currentTime: number;
  duration: number;
}

export const Turntable3D: React.FC<Turntable3DProps> = ({
  activeTrack,
  isPlaying,
  pitch,
  speedMode,
  cueingLeverUp,
  onNeedleDrop,
  onNeedleLift,
  onSettingsChange,
  currentTime,
  duration,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const stateRef = useRef({
    isPlaying,
    currentTime,
    duration,
    pitch,
    speedMode,
    cueingLeverUp,
    motorSpeed: 0.0,
    currentArmYRot: 1.35,
    targetArmYRot: 1.35,
    armLiftAmount: 1.0,
    isGrabbing: false,
    platterX: -0.5,
    platterZ: 0.0,
    armPivotX: 1.05,
    armPivotZ: -0.82,
    angleRest: 1.35,
    angleLeadIn: 0.92,
    angleLeadOut: 0.42,
  });

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
    stateRef.current.pitch = pitch;
    stateRef.current.speedMode = speedMode;
    stateRef.current.cueingLeverUp = cueingLeverUp;
  }, [isPlaying, pitch, speedMode, cueingLeverUp]);

  useEffect(() => {
    stateRef.current.currentTime = currentTime;
    stateRef.current.duration = duration;
  }, [currentTime, duration]);

  useEffect(() => {
    const container = mountRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 4.2, 5.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.8;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.set(0, 0.1, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));

    const keyLight = new THREE.SpotLight(0xfff4e0, 20, 16, Math.PI / 3.5, 0.4, 1.0);
    keyLight.position.set(2.5, 7, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xaac8ff, 2.4);
    rimLight.position.set(-3.5, 4.5, -4);
    scene.add(rimLight);

    const cueLight = new THREE.PointLight(0xffaa44, 2.2, 5);
    cueLight.position.set(-1.2, 0.7, 0.9);
    scene.add(cueLight);

    const pulseLight = new THREE.PointLight(0xff9922, 1.4, 4.2);
    pulseLight.position.set(stateRef.current.platterX, 0.38, stateRef.current.platterZ);
    scene.add(pulseLight);

    const floorGeo = new THREE.PlaneGeometry(18, 18);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x060508, roughness: 0.1, metalness: 0.92 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.44;
    floor.receiveShadow = true;
    scene.add(floor);

    const plinthGroup = new THREE.Group();
    scene.add(plinthGroup);

    const plinthBodyGeo = new THREE.BoxGeometry(3.9, 0.38, 3.05);
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x3a3c42, roughness: 0.16, metalness: 0.88 });
    const plinthBody = new THREE.Mesh(plinthBodyGeo, plinthMat);
    plinthBody.position.y = -0.2;
    plinthBody.castShadow = true;
    plinthBody.receiveShadow = true;
    plinthGroup.add(plinthBody);

    const topPlateGeo = new THREE.BoxGeometry(3.86, 0.07, 3.01);
    const topPlateMat = new THREE.MeshStandardMaterial({ color: 0xb8bcc8, roughness: 0.12, metalness: 0.97 });
    const topPlate = new THREE.Mesh(topPlateGeo, topPlateMat);
    topPlate.position.y = 0.025;
    topPlate.castShadow = true;
    topPlate.receiveShadow = true;
    plinthGroup.add(topPlate);

    const footMat = new THREE.MeshStandardMaterial({ color: 0x0e0d12, roughness: 0.9 });
    for (const [x, z] of [[-1.78, -1.32], [1.78, -1.32], [-1.78, 1.32], [1.78, 1.32]]) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.09, 16), footMat);
      foot.position.set(x, -0.44, z);
      foot.castShadow = true;
      plinthGroup.add(foot);
    }

    const ledGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.022, 12);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00ff77 });
    const statusLed = new THREE.Mesh(ledGeo, ledMat);
    statusLed.position.set(-1.62, 0.07, 1.18);
    plinthGroup.add(statusLed);

    const platterGroup = new THREE.Group();
    platterGroup.position.set(stateRef.current.platterX, 0.07, stateRef.current.platterZ);
    plinthGroup.add(platterGroup);

    const platterGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.09, 72);
    const platterMat = new THREE.MeshStandardMaterial({ color: 0x7a746c, roughness: 0.18, metalness: 0.96 });
    const platter = new THREE.Mesh(platterGeo, platterMat);
    platter.castShadow = true;
    platter.receiveShadow = true;
    platterGroup.add(platter);

    const strobeMat = new THREE.MeshStandardMaterial({ color: 0xdde0e8, roughness: 0.28, metalness: 0.88 });
    for (let i = 0; i < 96; i++) {
      const angle = (i / 96) * Math.PI * 2;
      const dot = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.038, 0.013), strobeMat);
      dot.position.set(Math.cos(angle) * 1.285, 0.018, Math.sin(angle) * 1.285);
      dot.rotation.y = -angle;
      platter.add(dot);
    }

    const feltGeo = new THREE.CylinderGeometry(1.26, 1.26, 0.018, 72);
    const feltMat = new THREE.MeshStandardMaterial({ color: 0x14121a, roughness: 0.96 });
    const felt = new THREE.Mesh(feltGeo, feltMat);
    felt.position.y = 0.054;
    platterGroup.add(felt);

    const spindle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.34, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4af5c, metalness: 0.9, roughness: 0.14 })
    );
    spindle.position.set(0, 0.11, 0);
    platterGroup.add(spindle);

    const vinylGroup = new THREE.Group();
    vinylGroup.position.set(0, 0.072, 0);
    platterGroup.add(vinylGroup);

    const vCanvas = document.createElement('canvas');
    vCanvas.width = vCanvas.height = 512;
    const vCtx = vCanvas.getContext('2d')!;
    vCtx.fillStyle = '#09090c';
    vCtx.fillRect(0, 0, 512, 512);
    for (let r = 48; r < 246; r += 2.4) {
      vCtx.beginPath();
      vCtx.arc(256, 256, r, 0, Math.PI * 2);
      vCtx.strokeStyle = `rgba(190,175,220,${0.025 + 0.05 * Math.abs(Math.sin(r * 0.42))})`;
      vCtx.lineWidth = 0.9;
      vCtx.stroke();
    }
    const grooveTex = new THREE.CanvasTexture(vCanvas);

    const vinylGeo = new THREE.CylinderGeometry(1.24, 1.24, 0.014, 72);
    const vinylMat = new THREE.MeshStandardMaterial({
      color: 0x100e14,
      roughness: 0.08,
      metalness: 0.88,
      map: grooveTex,
      envMapIntensity: 2.8,
    });
    const vinylBody = new THREE.Mesh(vinylGeo, vinylMat);
    vinylBody.castShadow = true;
    vinylGroup.add(vinylBody);

    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = labelCanvas.height = 256;
    const lCtx = labelCanvas.getContext('2d')!;
    const labelTex = new THREE.CanvasTexture(labelCanvas);

    const paintLabel = () => {
      lCtx.clearRect(0, 0, 256, 256);
      const grad = lCtx.createRadialGradient(128, 128, 0, 128, 128, 120);
      grad.addColorStop(0, '#f0d8a8');
      grad.addColorStop(0.6, '#e4c680');
      grad.addColorStop(1, '#c9a455');
      lCtx.fillStyle = grad;
      lCtx.beginPath();
      lCtx.arc(128, 128, 120, 0, Math.PI * 2);
      lCtx.fill();

      lCtx.strokeStyle = 'rgba(100,60,20,0.22)';
      lCtx.lineWidth = 3;
      lCtx.beginPath();
      lCtx.arc(128, 128, 116, 0, Math.PI * 2);
      lCtx.stroke();

      lCtx.fillStyle = '#6b3c14';
      lCtx.font = 'bold 18px "Playfair Display", Georgia, serif';
      lCtx.textAlign = 'center';
      const title = activeTrack ? activeTrack.title : 'NO RECORD';
      lCtx.fillText(title.substring(0, 16).toUpperCase(), 128, 92);

      lCtx.font = 'italic 11px Inter, sans-serif';
      lCtx.fillStyle = '#4a2f12';
      lCtx.fillText((activeTrack ? activeTrack.artist : 'Load a folder').substring(0, 22), 128, 118);

      lCtx.font = 'bold 8px monospace';
      lCtx.fillStyle = 'rgba(80,45,15,0.5)';
      lCtx.fillText('STEREO  LP  33⅓ RPM', 128, 162);

      labelTex.needsUpdate = true;
    };

    const labelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.016, 36);
    const labelMat = new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.62 });
    const recordLabel = new THREE.Mesh(labelGeo, labelMat);
    recordLabel.position.y = 0.004;
    vinylGroup.add(recordLabel);
    paintLabel();

    const armPivotGroup = new THREE.Group();
    armPivotGroup.position.set(stateRef.current.armPivotX, 0.07, stateRef.current.armPivotZ);
    plinthGroup.add(armPivotGroup);

    const brassMat = new THREE.MeshStandardMaterial({ color: 0xc8a25a, roughness: 0.14, metalness: 0.9 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x1c1b22, roughness: 0.28, metalness: 0.84 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xdadae8, roughness: 0.1, metalness: 0.96 });

    const baseCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.21, 0.09, 24), brassMat);
    baseCollar.position.y = 0.02;
    baseCollar.castShadow = true;
    armPivotGroup.add(baseCollar);

    const gimbal = new THREE.Mesh(new THREE.CylinderGeometry(0.076, 0.076, 0.2, 16), darkMetalMat);
    gimbal.position.y = 0.15;
    gimbal.castShadow = true;
    armPivotGroup.add(gimbal);

    const armWandGroup = new THREE.Group();
    armWandGroup.position.set(0, 0.25, 0);
    armPivotGroup.add(armWandGroup);

    const counterRod = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.42, 8), darkMetalMat);
    counterRod.rotation.x = Math.PI / 2;
    counterRod.position.set(0, 0, -0.21);
    armWandGroup.add(counterRod);

    const counterWeight = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.11, 16), brassMat);
    counterWeight.rotation.x = Math.PI / 2;
    counterWeight.position.set(0, 0, -0.34);
    counterWeight.castShadow = true;
    armWandGroup.add(counterWeight);

    const tubeGroup = new THREE.Group();
    armWandGroup.add(tubeGroup);

    const armSegCount = 26;
    const wandLen = 1.62;
    const wandPts: THREE.Vector3[] = [];
    for (let i = 0; i <= armSegCount; i++) {
      const t = i / armSegCount;
      const z = t * wandLen;
      const sx = Math.sin(t * Math.PI * 1.5) * 0.13 * (1 - Math.cos(t * Math.PI * 0.5));
      wandPts.push(new THREE.Vector3(sx, 0, z));
    }

    for (let i = 0; i < armSegCount; i++) {
      const p1 = wandPts[i];
      const p2 = wandPts[i + 1];
      const d = p1.distanceTo(p2);
      const r1 = 0.013 * (1 - 0.38 * (i / armSegCount));
      const r2 = 0.013 * (1 - 0.38 * ((i + 1) / armSegCount));
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, d, 8), silverMat);
      seg.position.copy(p1).add(p2).multiplyScalar(0.5);
      seg.lookAt(p2);
      seg.rotation.x += Math.PI / 2;
      seg.castShadow = true;
      tubeGroup.add(seg);
    }

    const headshellGroup = new THREE.Group();
    headshellGroup.position.copy(wandPts[armSegCount]);
    headshellGroup.rotation.y = -0.14;
    tubeGroup.add(headshellGroup);

    const shellGeo = new THREE.BoxGeometry(0.076, 0.022, 0.155);
    shellGeo.translate(0, 0, 0.058);
    const headshell = new THREE.Mesh(shellGeo, new THREE.MeshStandardMaterial({ color: 0x131318, roughness: 0.38, metalness: 0.42 }));
    headshell.name = 'headshell_interactive';
    headshell.castShadow = true;
    headshellGroup.add(headshell);

    const liftFinger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.075, 8),
      brassMat
    );
    liftFinger.rotation.z = Math.PI / 2.2;
    liftFinger.position.set(0.048, 0.02, 0.058);
    liftFinger.name = 'headshell_interactive';
    headshellGroup.add(liftFinger);

    const cartGeo = new THREE.BoxGeometry(0.042, 0.033, 0.076);
    cartGeo.translate(0, -0.024, 0.048);
    const cartridge = new THREE.Mesh(cartGeo, new THREE.MeshStandardMaterial({ color: 0xc22836, roughness: 0.55 }));
    headshellGroup.add(cartridge);

    const needleGeo = new THREE.CylinderGeometry(0.0018, 0.0005, 0.048, 6);
    const needle = new THREE.Mesh(needleGeo, new THREE.MeshStandardMaterial({ color: 0xc8b860, metalness: 0.96 }));
    needle.position.set(0, -0.049, 0.077);
    needle.rotation.x = -0.28;
    headshellGroup.add(needle);

    const restAngle = stateRef.current.angleRest;
    const rxp = stateRef.current.armPivotX + Math.sin(restAngle) * 0.95;
    const rzp = stateRef.current.armPivotZ + Math.cos(restAngle) * 0.95;
    const armrestGroup = new THREE.Group();
    armrestGroup.position.set(rxp, 0.07, rzp);
    plinthGroup.add(armrestGroup);

    const postMat = new THREE.MeshStandardMaterial({ color: 0x1d1b22, metalness: 0.42 });
    const restPost = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.26, 10), postMat);
    restPost.position.y = 0.13;
    restPost.castShadow = true;
    armrestGroup.add(restPost);
    const cradleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.038, 16, 1, true), postMat);
    cradleMesh.rotation.x = Math.PI / 2;
    cradleMesh.position.y = 0.264;
    armrestGroup.add(cradleMesh);

    const cueLeverGroup = new THREE.Group();
    cueLeverGroup.position.set(0.76, 0.09, -0.9);
    plinthGroup.add(cueLeverGroup);

    cueLeverGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.038, 0.13), darkMetalMat));
    const leverRod = new THREE.Mesh(
      (() => { const g = new THREE.CylinderGeometry(0.0055, 0.0055, 0.135, 8); g.translate(0, 0.068, 0); return g; })(),
      silverMat
    );
    leverRod.name = 'cue_lever_interactive';
    leverRod.castShadow = true;
    cueLeverGroup.add(leverRod);

    const ssGeo = new THREE.CylinderGeometry(0.078, 0.083, 0.038, 24);
    ssGeo.translate(0, 0.02, 0);
    const ssBtn = new THREE.Mesh(ssGeo, new THREE.MeshStandardMaterial({ color: 0x4d4b56, roughness: 0.14, metalness: 0.9 }));
    ssBtn.position.set(-1.62, 0.07, 1.26);
    ssBtn.name = 'start_stop_button_interactive';
    ssBtn.castShadow = true;
    plinthGroup.add(ssBtn);

    const spBtnGeo = new THREE.CylinderGeometry(0.048, 0.053, 0.028, 16);
    spBtnGeo.translate(0, 0.014, 0);
    const spBtn = new THREE.Mesh(spBtnGeo, new THREE.MeshStandardMaterial({ color: 0x4d4b56, roughness: 0.14, metalness: 0.9 }));
    spBtn.position.set(-1.32, 0.07, 1.26);
    spBtn.name = 'speed_mode_button_interactive';
    spBtn.castShadow = true;
    plinthGroup.add(spBtn);

    const faderTrack = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.009, 0.68),
      darkMetalMat
    );
    faderTrack.position.set(1.66, 0.065, 0.32);
    plinthGroup.add(faderTrack);

    const faderCap = new THREE.Mesh(
      new THREE.BoxGeometry(0.058, 0.058, 0.048),
      silverMat
    );
    faderCap.name = 'pitch_fader_cap';
    faderCap.castShadow = true;
    faderCap.position.set(1.66, 0.094, 0.32);
    plinthGroup.add(faderCap);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDraggingFader = false;
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.34);

    const getPointerCoords = (e: MouseEvent | TouchEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      let cx = 0, cy = 0;
      if (e instanceof MouseEvent) { cx = e.clientX; cy = e.clientY; }
      else if (e.touches?.[0]) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
      return {
        x: ((cx - rect.left) / rect.width) * 2 - 1,
        y: -((cy - rect.top) / rect.height) * 2 + 1,
      };
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getPointerCoords(e);
      mouse.set(x, y);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      if (!hits.length) return;

      if (hits.find(h => h.object.name === 'headshell_interactive')) {
        controls.enabled = false;
        stateRef.current.isGrabbing = true;
        onSettingsChange({ isGrabbingHeadshell: true });
        return;
      }
      if (hits.find(h => h.object.name === 'cue_lever_interactive')) {
        onSettingsChange({ cueingLeverUp: !stateRef.current.cueingLeverUp });
        return;
      }
      if (hits.find(h => h.object.name === 'start_stop_button_interactive')) {
        ssBtn.position.y = 0.048;
        setTimeout(() => { ssBtn.position.y = 0.07; }, 110);
        onSettingsChange({ isPlaying: !stateRef.current.isPlaying });
        return;
      }
      if (hits.find(h => h.object.name === 'speed_mode_button_interactive')) {
        spBtn.position.y = 0.046;
        setTimeout(() => { spBtn.position.y = 0.07; }, 110);
        onSettingsChange({ speedMode: stateRef.current.speedMode === 33 ? 45 : 33 });
        return;
      }
      if (hits.find(h => h.object.name === 'pitch_fader_cap')) {
        controls.enabled = false;
        isDraggingFader = true;
        return;
      }
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getPointerCoords(e);
      mouse.set(x, y);
      raycaster.setFromCamera(mouse, camera);

      if (stateRef.current.isGrabbing) {
        const pt = new THREE.Vector3();
        raycaster.ray.intersectPlane(dragPlane, pt);
        if (pt) {
          const dx = pt.x - stateRef.current.armPivotX;
          const dz = pt.z - stateRef.current.armPivotZ;
          let angle = Math.atan2(dx, dz);
          angle = Math.max(0.33, Math.min(1.44, angle));
          stateRef.current.targetArmYRot = angle;
          stateRef.current.currentArmYRot = angle;
        }
        return;
      }

      if (isDraggingFader) {
        const pt = new THREE.Vector3();
        raycaster.ray.intersectPlane(dragPlane, pt);
        if (pt) {
          let localZ = pt.z - 0.32;
          localZ = Math.max(-0.3, Math.min(0.3, localZ));
          faderCap.position.z = 0.32 + localZ;
          const pitchVal = -(localZ / 0.3) * 8.0;
          onSettingsChange({ pitch: parseFloat(pitchVal.toFixed(2)) });
        }
        return;
      }

      const hits = raycaster.intersectObjects(scene.children, true);
      const interactiveNames = ['headshell_interactive', 'cue_lever_interactive', 'start_stop_button_interactive', 'speed_mode_button_interactive', 'pitch_fader_cap'];
      const hovered = hits.find(h => interactiveNames.includes(h.object.name));
      setHoveredPart(hovered ? hovered.object.name : null);
      renderer.domElement.style.cursor = hovered ? 'grab' : 'default';
    };

    const onPointerUp = () => {
      controls.enabled = true;
      isDraggingFader = false;

      if (stateRef.current.isGrabbing) {
        stateRef.current.isGrabbing = false;
        onSettingsChange({ isGrabbingHeadshell: false });

        const angle = stateRef.current.currentArmYRot;
        const { angleLeadIn, angleLeadOut } = stateRef.current;

        if (angle >= angleLeadOut && angle <= angleLeadIn) {
          const progress = (angleLeadIn - angle) / (angleLeadIn - angleLeadOut);
          onNeedleDrop(progress);
        } else {
          stateRef.current.targetArmYRot = stateRef.current.angleRest;
          onNeedleLift();
        }
      }
    };

    renderer.domElement.addEventListener('mousedown', onPointerDown);
    renderer.domElement.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    renderer.domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    renderer.domElement.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    let animId = 0;
    let platterRot = 0;
    let elapsed = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      elapsed += dt;

      const targetMotor = stateRef.current.isPlaying ? 1.0 : 0.0;
      const motorInertia = targetMotor > stateRef.current.motorSpeed ? 0.75 : 0.42;
      stateRef.current.motorSpeed += (targetMotor - stateRef.current.motorSpeed) * motorInertia * dt * 2;
      audioEngine.setMotorSpeed(stateRef.current.motorSpeed);

      if (stateRef.current.motorSpeed > 0.001) {
        const rpm = stateRef.current.speedMode === 33 ? 33.33 : 45.0;
        const pf = 1.0 + stateRef.current.pitch / 100;
        platterRot += (rpm / 60) * Math.PI * 2 * stateRef.current.motorSpeed * pf * dt;
        platter.rotation.y = platterRot;
        vinylGroup.rotation.y = platterRot;
      }

      const targetLift = (stateRef.current.cueingLeverUp || stateRef.current.isGrabbing) ? 1.0 : 0.0;
      const liftInertia = targetLift > stateRef.current.armLiftAmount ? 5.0 : 2.4;
      stateRef.current.armLiftAmount += (targetLift - stateRef.current.armLiftAmount) * liftInertia * dt;
      armWandGroup.rotation.x = -0.055 * stateRef.current.armLiftAmount;

      if (stateRef.current.isPlaying && !stateRef.current.isGrabbing && stateRef.current.duration > 0 && stateRef.current.armLiftAmount < 0.05) {
        const pct = stateRef.current.currentTime / stateRef.current.duration;
        const { angleLeadIn, angleLeadOut } = stateRef.current;
        stateRef.current.targetArmYRot = angleLeadIn - (angleLeadIn - angleLeadOut) * pct;
      }

      const sweepI = stateRef.current.isGrabbing ? 1.0 : 2.4;
      stateRef.current.currentArmYRot += (stateRef.current.targetArmYRot - stateRef.current.currentArmYRot) * sweepI * dt;
      gimbal.rotation.y = stateRef.current.currentArmYRot;
      leverRod.rotation.x = stateRef.current.cueingLeverUp ? 0.33 : -0.14;

      if (!isDraggingFader) {
        faderCap.position.z = 0.32 - (stateRef.current.pitch / 8.0) * 0.3;
      }

      if (stateRef.current.isPlaying) {
        pulseLight.intensity = 1.5 + Math.sin(elapsed * 5.8) * 0.42;
        pulseLight.color.setHex(0xffaa44);
        (statusLed.material as THREE.MeshBasicMaterial).color.setHex(0x00ff88);
      } else {
        pulseLight.intensity = 0.55 + Math.sin(elapsed * 1.4) * 0.18;
        pulseLight.color.setHex(0xff7722);
        const br = Math.floor(128 + Math.sin(elapsed * 2.4) * 58);
        (statusLed.material as THREE.MeshBasicMaterial).color.setRGB(1.0, br / 255, 0.0);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const cw = mountRef.current.clientWidth;
      const ch = mountRef.current.clientHeight;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch, false);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      renderer.domElement.removeEventListener('mousedown', onPointerDown);
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('touchstart', onPointerDown);
      renderer.domElement.removeEventListener('touchmove', onPointerMove);
      renderer.dispose();
    };
  }, [activeTrack]);

  const hoverLabels: Record<string, string> = {
    headshell_interactive: 'Headshell — Drag to cue',
    cue_lever_interactive: 'Cueing Lever — Click to toggle',
    start_stop_button_interactive: 'Start / Stop Motor',
    speed_mode_button_interactive: 'Speed Mode 33 / 45 RPM',
    pitch_fader_cap: 'Pitch Fader — Drag to adjust',
  };

  return (
    <div className="relative w-full h-full min-h-[300px] flex-1 overflow-hidden" ref={mountRef}>
      <canvas ref={canvasRef} className="block w-full h-full outline-none" />
      {hoveredPart && (
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono select-none uppercase tracking-widest pointer-events-none animate-fade-in-up">
          {hoverLabels[hoveredPart] ?? hoveredPart.replace('_interactive', '').replace(/_/g, ' ')}
        </div>
      )}
    </div>
  );
};
