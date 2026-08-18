import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, RoundedBox } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

const DocumentAndPen = () => {
  const groupRef = useRef<THREE.Group>(null);
  const penRef = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Document floats on the right
      groupRef.current.position.x = 4 + scroll * 1.5;
      groupRef.current.position.y = 0 - scroll * 2;
      
      // Start flat-ish, tilt to face camera as user scrolls down
      groupRef.current.rotation.x = -Math.PI / 3 + scroll * Math.PI / 4; 
      groupRef.current.rotation.y = -0.2 + scroll * 0.4;
      // Gentle floating animation
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.05; 
    }

    if (penRef.current) {
      // Pen "signs" the document as the user scrolls
      penRef.current.position.x = Math.sin(scroll * Math.PI * 6) * 0.6 + scroll * 0.5; // signing zig-zag
      penRef.current.position.z = scroll * 2.5 - 1.2; // moving down the page
      
      // Lift off page slightly during motion
      penRef.current.position.y = 0.5 + Math.abs(Math.cos(scroll * Math.PI * 12) * 0.15); 
      
      penRef.current.rotation.x = -Math.PI / 4;
      penRef.current.rotation.z = 0.2 + Math.sin(scroll * Math.PI * 6) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[4, -1, -5]} scale={1.2}>
      {/* Clipboard / Base */}
      <RoundedBox args={[3, 0.2, 4]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      
      {/* Paper */}
      <RoundedBox args={[2.7, 0.05, 3.7]} radius={0.02} smoothness={4} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#F8FAFC" roughness={0.9} />
      </RoundedBox>

      {/* Text lines on paper representing loan details */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0, 0.18, -1.2 + i * 0.4]}>
          <boxGeometry args={[2, 0.01, 0.1]} />
          <meshStandardMaterial color="#CBD5E1" />
        </mesh>
      ))}
      <mesh position={[-0.5, 0.18, 1.2]}>
        <boxGeometry args={[1, 0.01, 0.1]} />
        <meshStandardMaterial color="#CBD5E1" />
      </mesh>

      {/* Signature line at the bottom */}
      <mesh position={[0.5, 0.18, 1.5]}>
        <boxGeometry args={[1.2, 0.01, 0.03]} />
        <meshStandardMaterial color="#94A3B8" />
      </mesh>
      
      {/* The Pen */}
      <group ref={penRef} position={[0, 0.5, -1]}>
        {/* Pen Body */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Pen Golden Accent Ring */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.062, 0.062, 0.1, 16]} />
          <meshStandardMaterial color="#FBBF24" metalness={1} roughness={0.1} />
        </mesh>
        {/* Pen Tip */}
        <mesh position={[0, 0, 0]}>
          <coneGeometry args={[0.06, 0.25, 16]} />
          <meshStandardMaterial color="#D97706" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Pen Clip */}
        <mesh position={[0.07, 0.9, 0]}>
          <boxGeometry args={[0.02, 0.4, 0.02]} />
          <meshStandardMaterial color="#FBBF24" metalness={1} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

export const ScrollLinkedDocument = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, 5, -5]} intensity={1} color="#EA580C" />
        <Environment preset="city" />
        <DocumentAndPen />
      </Canvas>
    </div>
  );
};
