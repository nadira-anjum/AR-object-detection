import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Rotating group wrapper (nice polish)
function Rotating({ children }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.6;
  });
  return <group ref={ref}>{children}</group>;
}

// --- Procedural “models” per class ---
function PersonModel() {
  // Simple “stick-figure / mannequin” style
  return (
    <group>
      {/* torso */}
      <mesh position={[0, 0.2, 0]}>
        <capsuleGeometry args={[0.18, 0.5, 8, 16]} />
        <meshStandardMaterial />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial />
      </mesh>
      {/* legs */}
      <mesh position={[-0.1, -0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.55, 12]} />
        <meshStandardMaterial />
      </mesh>
      <mesh position={[0.1, -0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.55, 12]} />
        <meshStandardMaterial />
      </mesh>
      {/* arms */}
      <mesh position={[-0.35, 0.25, 0]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.05, 0.05, 0.55, 12]} />
        <meshStandardMaterial />
      </mesh>
      <mesh position={[0.35, 0.25, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <cylinderGeometry args={[0.05, 0.05, 0.55, 12]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
}

function PhoneModel() {
  return (
    <group>
      {/* body */}
      <mesh>
        <boxGeometry args={[0.55, 1.05, 0.08]} />
        <meshStandardMaterial />
      </mesh>
      {/* screen */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.48, 0.9, 0.01]} />
        <meshStandardMaterial />
      </mesh>
      {/* camera bump */}
      <mesh position={[-0.18, 0.38, 0.055]}>
        <boxGeometry args={[0.16, 0.16, 0.02]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
}

function BottleModel() {
  return (
    <group>
      {/* body */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.9, 20]} />
        <meshStandardMaterial />
      </mesh>
      {/* neck */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.25, 16]} />
        <meshStandardMaterial />
      </mesh>
      {/* cap */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.12, 16]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
}

function CupModel() {
  return (
    <group>
      {/* cup body */}
      <mesh>
        <cylinderGeometry args={[0.28, 0.22, 0.55, 20]} />
        <meshStandardMaterial />
      </mesh>
      {/* handle */}
      <mesh position={[0.33, 0.05, 0]}>
        <torusGeometry args={[0.16, 0.05, 12, 24]} />
        <meshStandardMaterial />
      </mesh>
      {/* rim */}
      <mesh position={[0, 0.28, 0]}>
        <torusGeometry args={[0.255, 0.03, 12, 28]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
}

function KeyboardModel() {
  return (
    <group>
      {/* base */}
      <mesh>
        <boxGeometry args={[1.2, 0.18, 0.55]} />
        <meshStandardMaterial />
      </mesh>

      {/* keys grid (simple) */}
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 10 }).map((__, c) => (
          <mesh
            key={`${r}-${c}`}
            position={[-0.54 + c * 0.12, 0.12, -0.22 + r * 0.11]}
          >
            <boxGeometry args={[0.09, 0.05, 0.08]} />
            <meshStandardMaterial />
          </mesh>
        ))
      )}
    </group>
  );
}

function ModelByClass({ objectClass }) {
  switch (objectClass) {
    case "person":
      return <PersonModel />;
    case "cell phone":
      return <PhoneModel />;
    case "bottle":
      return <BottleModel />;
    case "cup":
      return <CupModel />;
    case "keyboard":
      return <KeyboardModel />;
    default:
      // fallback “generic” 3D marker
      return (
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial />
        </mesh>
      );
  }
}

export default function ThreeModel({ objectClass = "person" }) {
  // camera distance based on model type (keyboard is wider)
  const cameraZ = useMemo(() => (objectClass === "keyboard" ? 3.2 : 2.4), [objectClass]);

  return (
    <div style={{ width: "100%", height: "230px" }}>
      <Canvas camera={{ position: [0, 1, cameraZ] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 4, 4]} intensity={1.0} />

        <Rotating>
          <ModelByClass objectClass={objectClass} />
        </Rotating>

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
