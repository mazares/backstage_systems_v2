import { use, useRef } from "react";

import {
  OrbitControls,
  Stage,
  Stars,
  Billboard,
  Text,
  SpotLight,
  Center,
  Float,
  Cloud
} from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function App() {
  const ref = useRef<THREE.Points>(null);
  const topSpotlights = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.001;
      ref.current.rotation.y += 0.001;
    }
  });

  useFrame(() => {
    if (topSpotlights.current) {
      topSpotlights.current.rotation.y += 0.001;
    }
  });

  const textMaterial = new THREE.MeshPhysicalMaterial({
    color: "red",
    roughness: 0.2,
    metalness: 1
  });

  const silverMaterial = new THREE.MeshPhysicalMaterial({
    color: "silver",
    roughness: 0.2,
    metalness: 1
  });

  function createSpotLight({
    name,
    x,
    y,
    z,
    color
  }: {
    name: string;
    x: number;
    y: number;
    z: number;
    color: string;
  }) {
    return (
      <SpotLight
        name={name}
        position={[x, y, z]}
        angle={12} // angle of the spotlight
        penumbra={1} // softness of the shadow
        intensity={7}
        distance={100}
        decay={2}
        color={color}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        shadow-camera-near={0.1}
        shadow-camera-far={100}
      />
    );
  }

  // avoid repeating the same code

  return (
    <Stage intensity={1} environment="studio" shadows adjustCamera>
      <ambientLight intensity={0.5} />

      <Stars
        ref={ref}
        radius={100}
        depth={50}
        count={5000}
        factor={5}
        saturation={1}
        fade
        speed={1}
      />

      <Center position={[0, 0, 0]}>
        <Float position={[-5, 0, 0]} speed={1}>
          <Cloud
            // reflect the spotlight colors

            receiveShadow={true}
            position={[0, 0, 0]}
            opacity={0.03}
            scale={2}
            fade={0.5}
            speed={1}
            rotateX={0.01}
            rotateY={0.01}
            rotateZ={0.01}
          />
        </Float>
      </Center>

      <group position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <group name="top_spotlights" ref={topSpotlights}>
            {Array.from({ length: 8 }).map((_, i) =>
              createSpotLight({
                name: `spot_light_${i}`,
                // dispose them in circle on top of the stage
                x: Math.sin((i / 8) * Math.PI * 2) * 10,
                y: 4,
                z: Math.cos((i / 8) * Math.PI * 2) * 10,
                // change the color of the spotlights
                color: `hsl(${i * 50}, 100%, 50%)`
              })
            )}
          </group>

          <Billboard
            position={[0, 0, 0]}
            follow={true}
            // reflect the spotlight colors
          >
            <Text
              position={[0, 0, 0]}
              material={textMaterial}
              // fontSize={1}
              fontWeight={"bold"}
            >
              backstage
            </Text>
            <Text
              position={[-0.5, -1, 0]}
              // fontSize={1}
              material={silverMaterial}
              fontWeight={"bold"}
            >
              systems
            </Text>
          </Billboard>
        </mesh>
      </group>
    </Stage>
  );
}

export default () => (
  <Canvas>
    <App />
    <OrbitControls
      // set an initial position

      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      enableDamping={true}
      dampingFactor={0.25}
      rotateSpeed={0.25}
      zoomSpeed={1.2}
      panSpeed={0.8}
      screenSpacePanning={true}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      minAzimuthAngle={-Infinity}
      maxAzimuthAngle={Infinity}
      maxDistance={50}
      minDistance={25}
    />
    {/* <pointLight position={[0, 0, 1]} intensity={500} /> */}
  </Canvas>
);
