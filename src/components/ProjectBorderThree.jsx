import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedBorder({ isHovered }) {
  const meshRef = useRef();
  const pulseRef = useRef();

  // Define a path for the border trace
  // Assuming a standard card aspect ratio normalized to roughly 4:6
  const width = 4;
  const height = 6.2;
  const thickness = 0.05;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      // Rotate slightly when hovered
      const targetRotX = isHovered ? 0.1 : 0;
      const targetRotY = isHovered ? 0.1 : 0;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.1);
    }

    if (pulseRef.current && isHovered) {
      // Move a "light pulse" around the border
      // This is a simplified trace logic
      const speed = 2;
      const loopTime = time * speed;
      const totalLen = (width + height) * 2;
      const currentPos = loopTime % totalLen;

      if (currentPos < width) { // Top
        pulseRef.current.position.set(-width / 2 + currentPos, height / 2, 0.01);
      } else if (currentPos < width + height) { // Right
        pulseRef.current.position.set(width / 2, height / 2 - (currentPos - width), 0.01);
      } else if (currentPos < width * 2 + height) { // Bottom
        pulseRef.current.position.set(width / 2 - (currentPos - (width + height)), -height / 2, 0.01);
      } else { // Left
        pulseRef.current.position.set(-width / 2, -height / 2 + (currentPos - (width * 2 + height)), 0.01);
      }
      pulseRef.current.scale.setScalar(1 + Math.sin(time * 10) * 0.2);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Static Border Frame */}
      <mesh>
        <ringGeometry args={[height / 2 - 0.02, height / 2, 4]} /> {/* Not ideal for rect, using 4 points plane instead */}
      </mesh>

      {/* Box Border using wireframe or custom planes */}
      {/* Top */}
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, thickness]} />
        <meshBasicMaterial color={isHovered ? "#0ea5e9" : "#334155"} transparent opacity={0.5} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -height / 2, 0]}>
        <planeGeometry args={[width, thickness]} />
        <meshBasicMaterial color={isHovered ? "#0ea5e9" : "#334155"} transparent opacity={0.5} />
      </mesh>
      {/* Left */}
      <mesh position={[-width / 2, 0, 0]}>
        <planeGeometry args={[thickness, height]} />
        <meshBasicMaterial color={isHovered ? "#0ea5e9" : "#334155"} transparent opacity={0.5} />
      </mesh>
      {/* Right */}
      <mesh position={[width / 2, 0, 0]}>
        <planeGeometry args={[thickness, height]} />
        <meshBasicMaterial color={isHovered ? "#0ea5e9" : "#334155"} transparent opacity={0.5} />
      </mesh>

      {/* Moving Light Pulse */}
      {isHovered && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#ffffff">
            <pointLight intensity={2} distance={2} color="#0ea5e9" />
          </meshBasicMaterial>
        </mesh>
      )}

      {/* Glowing background plane on hover */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent={true}
          opacity={isHovered ? 0.05 : 0}
        />
      </mesh>
    </group>
  );
}

const ProjectBorderThree = ({ isHovered }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas alpha={true}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
        <ambientLight intensity={0.5} />
        <AnimatedBorder isHovered={isHovered} />
      </Canvas>
    </div>
  );
};

export default ProjectBorderThree;
