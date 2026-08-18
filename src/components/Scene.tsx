import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, ContactShadows, RoundedBox, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ──────────────────────────────────────────────
   3D COIN  –  a stylised gold / brand-gradient coin
   ────────────────────────────────────────────── */
function Coin({ position, color = '#F97316', scale = 1, speed = 1 }: { position: [number, number, number]; color?: string; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.012 * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.15;
  });
  return (
    <Float speed={speed * 1.2} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={ref} position={position} scale={scale} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.15, 48]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.08} />
      </mesh>
    </Float>
  );
}

/* ──────────────────────────────────────────────
   3D CREDIT CARD  –  a rounded glass rectangle
   ────────────────────────────────────────────── */
function CreditCard3D({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.005;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.3;
  });
  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={1.5}>
      <group ref={ref} position={position} rotation={rotation || [0.3, 0.5, -0.1]}>
        <RoundedBox args={[3.2, 2, 0.08]} radius={0.15} smoothness={4} castShadow>
          <meshPhysicalMaterial
            color="#E11D48"
            metalness={0.6}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>
        {/* Card stripe */}
        <mesh position={[0, 0.4, 0.05]}>
          <boxGeometry args={[3, 0.35, 0.02]} />
          <meshStandardMaterial color="#FACC15" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Card chip */}
        <mesh position={[-0.8, -0.2, 0.06]}>
          <boxGeometry args={[0.4, 0.3, 0.02]} />
          <meshStandardMaterial color="#FACC15" metalness={1} roughness={0.05} />
        </mesh>
      </group>
    </Float>
  );
}

/* ──────────────────────────────────────────────
   3D BANK BUILDING  –  stylised with columns
   ────────────────────────────────────────────── */
function BankBuilding({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
  });

  const columns = useMemo(() => {
    const cols: [number, number, number][] = [];
    for (let i = -1.2; i <= 1.2; i += 0.6) {
      cols.push([i, 0.1, 0.7]);
    }
    return cols;
  }, []);

  return (
    <Float speed={0.6} rotationIntensity={0.2} floatIntensity={1}>
      <group ref={ref} position={position} scale={0.6}>
        {/* Base */}
        <mesh position={[0, -0.6, 0]} castShadow>
          <boxGeometry args={[3.5, 0.3, 2]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Main Body */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[3, 1.5, 1.5]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* Roof / Pediment */}
        <mesh position={[0, 1.35, 0]} castShadow>
          <boxGeometry args={[3.4, 0.15, 1.7]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.5} roughness={0.25} />
        </mesh>
        {/* Triangle pediment */}
        <mesh position={[0, 1.8, 0]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[1.8, 0.7, 4]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Columns */}
        {columns.map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 1.5, 12]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.5} roughness={0.2} />
          </mesh>
        ))}
        {/* Door */}
        <mesh position={[0, -0.05, 0.76]}>
          <boxGeometry args={[0.4, 0.8, 0.02]} />
          <meshStandardMaterial color="#F97316" metalness={0.6} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

/* ──────────────────────────────────────────────
   RUPEE SYMBOL  –  floating currency indicator
   ────────────────────────────────────────────── */
function RupeeSymbol({ position, scale = 0.5 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.02;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.4;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={2}>
      <mesh ref={ref} position={position} scale={scale} castShadow>
        <torusGeometry args={[0.6, 0.2, 16, 48]} />
        <meshStandardMaterial color="#FACC15" metalness={0.95} roughness={0.05} emissive="#FACC15" emissiveIntensity={0.1} />
      </mesh>
    </Float>
  );
}

/* ──────────────────────────────────────────────
   ABSTRACT GROWTH SPHERE  –  for Vision section
   ────────────────────────────────────────────── */
function GrowthSphere({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.2;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={ref} position={position} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#E11D48"
          metalness={0.6}
          roughness={0.2}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

/* ──────────────────────────────────────────────
   MOUSE TRACKING – Makes 3D scene follow cursor
   ────────────────────────────────────────────── */
function MouseTracker({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.15,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.1,
      0.05
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ──────────────────────────────────────────────
   HERO SCENE
   ────────────────────────────────────────────── */
export function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.8} castShadow />
      <spotLight position={[-5, 8, 5]} angle={0.3} penumbra={0.5} intensity={0.8} color="#F97316" />
      <Environment preset="city" />
      <MouseTracker>
        <CreditCard3D position={[-3.5, 0.5, -1]} />
        <BankBuilding position={[3.5, -0.5, -2]} />
        <Coin position={[-1, 2, 1]} color="#FACC15" scale={0.7} speed={1.2} />
        <Coin position={[2, -1.5, 0]} color="#F97316" scale={0.5} speed={0.8} />
        <Coin position={[0.5, 1.5, 2]} color="#E11D48" scale={0.4} speed={1.5} />
        <RupeeSymbol position={[-2, -1.5, 1.5]} scale={0.4} />
        <RupeeSymbol position={[4, 1.5, 0]} scale={0.3} />
      </MouseTracker>
      <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} far={10} />
    </>
  );
}

/* ──────────────────────────────────────────────
   ABOUT SCENE – single bank building
   ────────────────────────────────────────────── */
export function AboutScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Environment preset="apartment" />
      <MouseTracker>
        <BankBuilding position={[0, 0, 0]} />
        <Coin position={[-2, 1, 1]} color="#F97316" scale={0.35} speed={1} />
        <Coin position={[2, -1, 1]} color="#FACC15" scale={0.3} speed={0.7} />
      </MouseTracker>
    </>
  );
}

/* ──────────────────────────────────────────────
   VISION SCENE – growth sphere
   ────────────────────────────────────────────── */
export function VisionScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <Environment preset="sunset" />
      <MouseTracker>
        <GrowthSphere position={[0, 0, 0]} />
        <RupeeSymbol position={[-2, 1, 0.5]} scale={0.35} />
        <RupeeSymbol position={[2, -1, 0.5]} scale={0.25} />
      </MouseTracker>
    </>
  );
}
