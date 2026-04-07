import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

export default function Background3D() {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: -1,
      pointerEvents: "none",
      opacity: 0.6,
      background: "radial-gradient(ellipse at 50% -20%, rgba(0, 212, 170, 0.05) 0%, transparent 60%)"
    }}>
      <Suspense fallback={null}>
        <Canvas style={{ pointerEvents: "none" }} camera={{ position: [0, 0, 1] }}>
          <Stars 
            radius={150} 
            depth={50} 
            count={4000} 
            factor={3} 
            saturation={0} 
            fade 
            speed={0.5} 
          />
        </Canvas>
      </Suspense>
      {/* Vignette mask to ensure content readability */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at center, transparent 0%, var(--bg-base) 140%)"
      }} />
    </div>
  );
}
