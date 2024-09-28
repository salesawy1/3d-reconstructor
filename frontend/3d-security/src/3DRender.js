import React, { useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'; // Add useLoader here
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

// Component to load and display the OBJ model
function Model({ path }) {
  const obj = useLoader(OBJLoader, path);
  return <primitive object={obj} scale={[0.5, 0.5, 0.5]} />;
}

// Custom component to handle WASD movement and mouse control
function Controls() {
  const { camera } = useThree();
  const moveSpeed = 0.1;
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();

  const handleKeyDown = (event) => {
    switch (event.code) {
      case 'KeyW':
        setMoveForward(true);
        break;
      case 'KeyS':
        setMoveBackward(true);
        break;
      case 'KeyA':
        setMoveLeft(true);
        break;
      case 'KeyD':
        setMoveRight(true);
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.code) {
      case 'KeyW':
        setMoveForward(false);
        break;
      case 'KeyS':
        setMoveBackward(false);
        break;
      case 'KeyA':
        setMoveLeft(false);
        break;
      case 'KeyD':
        setMoveRight(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) {
      velocity.z -= direction.z * moveSpeed;
    }
    if (moveLeft || moveRight) {
      velocity.x -= direction.x * moveSpeed;
    }

    camera.position.add(velocity);
  });

  return <PointerLockControls />;
}

// Main 3D rendering component
export default function ThreeDRender({ modelPath }) {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Model path={modelPath} />
      <Controls />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}