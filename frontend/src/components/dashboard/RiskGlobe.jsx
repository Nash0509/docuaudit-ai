import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function TechRings({ riskScore }) {
  const groupRef = useRef();
  
  // Theme-aware color mapping for 3D context
  const getBaseColor = () => {
    if (riskScore >= 70) return '#EF4444'; // var(--danger)
    if (riskScore >= 40) return '#F59E0B'; // var(--warn)
    return '#10B981'; // var(--success)
  };

  const baseColor = getBaseColor();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.elapsedTime;
      groupRef.current.children[0].rotation.x = t * 0.5;
      groupRef.current.children[0].rotation.y = t * 0.2;
      
      groupRef.current.children[1].rotation.y = t * 0.4;
      groupRef.current.children[1].rotation.z = t * 0.3;
      
      groupRef.current.children[2].rotation.x = t * 0.3;
      groupRef.current.children[2].rotation.z = t * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Inner Ring */}
        <mesh>
          <torusGeometry args={[0.8, 0.04, 16, 100]} />
          <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={baseColor} emissiveIntensity={0.5} />
        </mesh>
        
        {/* Middle Ring */}
        <mesh>
          <torusGeometry args={[1.2, 0.02, 16, 100]} />
          <meshStandardMaterial color={baseColor} transparent opacity={0.6} metalness={1} roughness={0.1} />
        </mesh>

        {/* Outer Ring */}
        <mesh>
          <torusGeometry args={[1.6, 0.01, 16, 100]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>

        {/* Core Core */}
        <Sphere args={[0.3, 32, 32]}>
           <meshStandardMaterial color={baseColor} metalness={0.5} roughness={0.5} transparent opacity={0.8}/>
        </Sphere>
      </group>
    </Float>
  );
}

export default function RiskGlobe({ riskScore = 0 }) {
  return (
    <div style={{ height: "180px", width: "100%", position: "relative" }}>
      <Suspense fallback={
        <div style={{
          height: "180px", display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: "8px",
          color: "var(--text-muted)", fontSize: "12px",
        }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          Loading Visualizer...
        </div>
      }>
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 2]} alpha={true}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
          <pointLight position={[-5, -3, -5]} intensity={1} color={riskScore >= 70 ? '#EF4444' : '#10B981'} />
          <TechRings riskScore={riskScore} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </Suspense>
    </div>
  );
}
