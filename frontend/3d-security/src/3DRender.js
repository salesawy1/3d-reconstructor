import React, { useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'; 
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

// Component to load and display the OBJ model
function Model({ path }) {
    const obj = useLoader(OBJLoader, path); // Load only the OBJ file

    return <primitive object={obj} />;
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

        // Apply movement only if there is direction input
        if (direction.length() > 0) {
            velocity.z -= direction.z * moveSpeed;
            velocity.x -= direction.x * moveSpeed;
            camera.position.add(velocity);
        }
    });

    return <PointerLockControls />;
}

// Main 3D rendering component
export default function ThreeDRender({ modelPath }) {
    return (
        <Canvas style={{ width: '100vw', height: '100vh', margin: 0, overflow: 'hidden' }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <directionalLight position={[-5, 5, 5]} intensity={1} />
            <Model path={modelPath} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <Controls /> {/* Include the Controls component */}
        </Canvas>
    );
}
