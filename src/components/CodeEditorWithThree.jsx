import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

// 3D Box component that rotates smoothly
function AnimatedBox({ hovered }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Idle rotation + faster on hover
      const baseSpeed = 0.004;
      const speed = hovered ? baseSpeed * 6 : baseSpeed;
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 1.1;

      // Subtle floating effect (idle and stronger on hover)
      const floatSpeed = hovered ? 2 : 0.6;
      const floatAmp = hovered ? 0.15 : 0.03;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmp;
    }
  });

  return (
    <Box
      ref={meshRef}
      args={[1.5, 1.5, 1.5]}
      scale={hovered ? 1.1 : 1}
    >
      <meshStandardMaterial
        color={hovered ? '#0ea5e9' : '#7e22ce'}
        wireframe={true}
        transparent={true}
        opacity={0.6}
      />
    </Box>
  );
}

const CodeEditorWithThree = () => {
  const [hovered, setHovered] = useState(false);
  const [revealedLines, setRevealedLines] = useState(0);

  const codeLines = [
    { num: 1, content: <><span className="keyword">import</span> React <span className="keyword">from</span> <span className="string">'react'</span><span className="punctuation">;</span></> },
    { num: 2, content: '' },
    { num: 3, content: <><span className="keyword">const</span> <span className="function">Portfolio</span> <span className="punctuation">=</span> <span className="punctuation">()</span> <span className="keyword">=&gt;</span> <span className="punctuation">{'{'}</span></> },
    { num: 4, content: <>  <span className="keyword">return</span> <span className="punctuation">(</span></> },
    { num: 5, content: <>    <span className="jsx-tag">&lt;div</span> <span className="property">className</span><span className="punctuation">=</span><span className="string">"portfolio"</span><span className="jsx-tag">&gt;</span></> },
    { num: 6, content: <>      <span className="jsx-tag">&lt;h1&gt;</span>Welcome<span className="jsx-tag">&lt;/h1&gt;</span></> },
    { num: 7, content: <>      <span className="jsx-tag">&lt;p&gt;</span>Building amazing</> },
    { num: 8, content: <>         web experiences<span className="jsx-tag">&lt;/p&gt;</span></> },
    { num: 9, content: <>    <span className="jsx-tag">&lt;/div&gt;</span></> },
    { num: 10, content: <>  <span className="punctuation">);</span></> },
    { num: 11, content: <><span className="punctuation">{'}'};</span></> },
    { num: 12, content: '' },
    { num: 13, content: <><span className="keyword">export</span> <span className="keyword">default</span> Portfolio<span className="punctuation">;</span></> }
  ];

  // Reveal lines one by one to simulate typing; speed up when hovered
  useEffect(() => {
    let interval = null;
    // base delay per line (ms)
    const baseDelay = 140;
    const delay = hovered ? Math.max(40, baseDelay / 3) : baseDelay;

    if (revealedLines < codeLines.length) {
      interval = setInterval(() => {
        setRevealedLines((prev) => Math.min(codeLines.length, prev + 1));
      }, delay);
    } else {
      // loop after a pause to keep it dynamic
      interval = setTimeout(() => setRevealedLines(0), 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hovered, revealedLines, codeLines.length]);

  return (
    <div 
      className="code-editor-three-wrapper w-full max-w-md relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Three.js Background */}
      <div className="code-editor-three-bg">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <AnimatedBox hovered={hovered} />
        </Canvas>
      </div>

      {/* Code Editor Content */}
      <div className={`code-editor w-full max-w-md ${hovered ? 'hovered' : ''}`}>
        <div className="code-editor-header">
          <div className="code-editor-dots">
            <div className="dot dot-red"></div>
            <div className="dot dot-yellow"></div>
            <div className="dot dot-green"></div>
          </div>
          <div className="code-editor-title">
            <i className="fab fa-react"></i> Portfolio.jsx
          </div>
          <div style={{ width: '60px' }}></div>
        </div>
        <div className="code-editor-body">
          {codeLines.map((line) => (
            <div key={line.num} className="code-line">
              <span className="line-number">{line.num}</span>
              <span className="line-content">
                {line.num <= revealedLines ? (
                  line.content
                ) : (
                  <span className="line-placeholder">&nbsp;</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeEditorWithThree;
