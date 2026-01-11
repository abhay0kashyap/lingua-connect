
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Html, Stars, useTexture, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { ORBIT_GREETINGS } from '../constants';
import { X, Volume2 } from 'lucide-react';

// Fix for JSX element type errors in React Three Fiber
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      sphereGeometry: any;
      shaderMaterial: any;
      meshStandardMaterial: any;
      group: any;
      meshBasicMaterial: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      directionalLight: any;
    }
  }
}

// --- CONFIGURATION ---
const EARTH_MAP = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg';
const CLOUD_MAP = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png';
const GLOBE_RADIUS = 2.0;

// --- ATMOSPHERE SHADERS (SOFT & MAGICAL) ---
const atmosphereVertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragmentShader = `
varying vec3 vNormal;
void main() {
  float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
  // Soft Cyan/Purple magical glow
  gl_FragColor = vec4(0.4, 0.8, 1.0, 0.5) * intensity * 2.5; 
}
`;

// --- SUB-COMPONENTS ---

const Atmosphere = () => {
  return (
    <mesh scale={[1.25, 1.25, 1.25]}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <shaderMaterial
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const [colorMap, cloudMap] = useTexture([EARTH_MAP, CLOUD_MAP]);

  useFrame((state, delta) => {
    // Gentle rotation
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.05 * delta;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.07 * delta;
    }
  });

  return (
    <group>
      {/* 1. Base Planet - Brighter, more toy-like */}
      <mesh 
        ref={earthRef}
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap}
          roughness={0.6}
          metalness={0.1}
          emissive="#1e1b4b"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* 2. Cloud Layer - Fluffy & Soft */}
      <mesh ref={cloudsRef} scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial 
          map={cloudMap}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Magical Glow */}
      <Atmosphere />
    </group>
  );
};

interface SatelliteProps {
  data: typeof ORBIT_GREETINGS[0];
  index: number;
  total: number;
}

const Satellite: React.FC<SatelliteProps> = ({ data, index, total }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // --- FLOATING BALLOON PHYSICS ---
  // Not a strict orbit. Drifting, bobbing, floating.
  const initialAngle = (index / total) * Math.PI * 2;
  const radiusBase = 3.5;
  const speed = 0.05 + Math.random() * 0.05;
  const yOffset = (Math.random() - 0.5) * 2; // Random height
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      
      // Calculate drifting position
      // It drifts slowly around the Y axis but also bobs up and down and breathes in/out
      const angle = initialAngle + t * speed * 0.5;
      const r = radiusBase + Math.sin(t * 0.5 + index) * 0.3; // Breathing radius
      
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = yOffset + Math.sin(t * 0.8 + index * 10) * 0.5; // Bobbing

      // Soft lerp to new position for buttery smoothness
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, x, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, y, 0.1);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, z, 0.1);

      // Rotate to face camera? The HTML component does this automatically.
    }
  });

  const playAudio = (text: string, lang: string) => {
    const u = new SpeechSynthesisUtterance(text);
    const localeMap: Record<string, string> = { 
      'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'ja': 'ja-JP', 
      'ar': 'ar-SA', 'de': 'de-DE', 'it': 'it-IT', 'hi': 'hi-IN' 
    };
    u.lang = localeMap[lang] || 'en-US';
    window.speechSynthesis.speak(u);
  };

  return (
    <group ref={groupRef}>
      {/* Visual Anchor (The balloon knot/dot) */}
      <mesh 
        onClick={() => setClicked(!clicked)} 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#fff" : "#2DD4BF"} 
          emissive={hovered ? "#fff" : "#2DD4BF"}
          emissiveIntensity={0.8}
          toneMapped={false} 
        />
      </mesh>
      
      {/* Floating UI Balloon */}
      <Html
        position={[0, 0.4, 0]} // Float slightly above the dot
        center
        distanceFactor={10}
        zIndexRange={[100, 0]}
        style={{ 
          pointerEvents: 'none', 
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Spring transition
          opacity: 1
        }}
      >
        <div className="relative pointer-events-auto transform transition-transform hover:scale-110">
        {clicked ? (
          // EXPANDED INTERACTIVE CARD (Balloon popped open)
          <div 
            className="p-5 rounded-[2rem] bg-slate-900/90 backdrop-blur-xl border-2 border-primary-400 shadow-[0_10px_40px_rgba(45,212,191,0.3)] min-w-[220px] text-center flex flex-col items-center gap-3 animate-in zoom-in duration-300"
          >
            <div className="flex w-full justify-between items-start">
               <span className="text-4xl filter drop-shadow-md transform -translate-y-2">{data.flag}</span>
               <button 
                  onClick={(e) => { e.stopPropagation(); setClicked(false); }}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1 transition-colors"
                >
                  <X size={14} />
               </button>
            </div>
            
            <div>
              <div className="text-3xl font-heading font-extrabold text-white leading-tight">{data.native}</div>
              <div className="text-primary-400 font-bold text-sm tracking-wide mt-1 opacity-80">{data.translation}</div>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); playAudio(data.native, data.lang); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-bold shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
            >
              <Volume2 size={18} />
              <span>Listen</span>
            </button>
          </div>
        ) : (
          // CLOSED BALLOON (Pill)
          <div 
            className={`
              flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-md border-2 transition-all duration-300 cursor-pointer select-none shadow-lg
              ${hovered 
                ? 'bg-white text-slate-900 border-white scale-110 shadow-[0_0_30px_rgba(255,255,255,0.4)]' 
                : 'bg-slate-900/60 text-white border-white/20 hover:border-primary-400'
              }
            `}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={(e) => { e.stopPropagation(); setClicked(true); }}
          >
            <span className="text-2xl drop-shadow-sm">{data.flag}</span>
            <span className="font-heading font-bold text-lg whitespace-nowrap tracking-wide">
              {data.native}
            </span>
          </div>
        )}
        
        {/* Little triangle pointer for the balloon */}
        {!clicked && (
          <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 rotate-45 border-r border-b transition-colors duration-300 ${hovered ? 'bg-white border-white' : 'bg-slate-900/60 border-white/20'}`}></div>
        )}
        </div>
      </Html>
    </group>
  );
};

// --- MAIN COMPONENT ---

const Globe3D: React.FC = () => {
  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 8.5], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="pointer-events-auto"
      >
        {/* Cinematic & Playful Lighting */}
        <ambientLight intensity={0.4} />
        {/* Warm sun-like light */}
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#FDBA74" />
        {/* Cool rim light */}
        <spotLight position={[-5, 5, -5]} intensity={2} color="#2DD4BF" angle={0.5} penumbra={1} />
        {/* Fill light */}
        <pointLight position={[0, -5, 5]} intensity={1} color="#A855F7" />

        {/* Magical Environment Particles */}
        <Sparkles count={150} scale={12} size={2} speed={0.4} opacity={0.5} color="#fff" />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
        
        {/* Scene Content */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <group position={[0, -0.2, 0]}> 
            <React.Suspense fallback={null}>
               <Earth />
            </React.Suspense>
            
            {ORBIT_GREETINGS.map((item, i) => (
              <Satellite 
                key={item.lang} 
                data={item} 
                index={i} 
                total={ORBIT_GREETINGS.length} 
              />
            ))}
          </group>
        </Float>

        {/* Controls: Very slow, soft rotation */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default Globe3D;
