import React, { useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

// Component to load and display the GLB model
function Model({ path }) {
    const { scene } = useLoader(GLTFLoader, path); // Load the GLB file

    useEffect(() => {
        return () => {
            // Dispose of the model resources when unmounted
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (child.material) {
                        child.material.dispose();
                    }
                }
            });
        };
    }, [scene]);

    // Scale the model
    const scale = 10; // Adjust the scale factor as needed
    return <primitive object={scene} scale={[scale, scale, scale]} />;
}

function Controls({ moveForward, setMoveForward, moveBackward, setMoveBackward, moveLeft, setMoveLeft, moveRight, setMoveRight, moveUp, setMoveUp, moveDown, setMoveDown, moveSpeed }) {
    const { camera } = useThree();

    const onKeyDown = (event) => {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                setMoveForward(true);
                break;
            case 'KeyS':
            case 'ArrowDown':
                setMoveBackward(true);
                break;
            case 'KeyA':
            case 'ArrowLeft':
                setMoveRight(true);
                break;
            case 'KeyD':
            case 'ArrowRight':
                setMoveLeft(true);
                break;
            case 'KeyQ':
                setMoveUp(true);
                break;
            case 'KeyE':
                setMoveDown(true);
                break;
            default:
                break;
        }
    };

    const onKeyUp = (event) => {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                setMoveForward(false);
                break;
            case 'KeyS':
            case 'ArrowDown':
                setMoveBackward(false);
                break;
            case 'KeyA':
            case 'ArrowLeft':
                setMoveRight(false);
                break;
            case 'KeyD':
            case 'ArrowRight':
                setMoveLeft(false);
                break;
            case 'KeyQ':
                setMoveUp(false);
                break;
            case 'KeyE':
                setMoveDown(false);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    useFrame(() => {
        const velocity = new THREE.Vector3();
        const direction = new THREE.Vector3();
        const right = new THREE.Vector3();
        const up = new THREE.Vector3(0, 1, 0); // Up direction

        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        right.crossVectors(camera.up, direction).normalize();

        if (moveForward) velocity.add(direction.clone().multiplyScalar(moveSpeed));
        if (moveBackward) velocity.add(direction.clone().multiplyScalar(-moveSpeed));
        if (moveLeft) velocity.add(right.clone().multiplyScalar(-moveSpeed));
        if (moveRight) velocity.add(right.clone().multiplyScalar(moveSpeed));
        if (moveUp) velocity.add(up.clone().multiplyScalar(moveSpeed));
        if (moveDown) velocity.add(up.clone().multiplyScalar(-moveSpeed));

        camera.position.add(velocity);
    });

    return <PointerLockControls />;
}

export default function ThreeDRender({ currentTime }) {
    const [modelIndex, setModelIndex] = useState(0); // Index for the model
    const [modelPath, setModelPath] = useState(`/mesh${modelIndex}.glb`); // Change file extension to .glb
    const [moveForward, setMoveForward] = useState(false);
    const [moveBackward, setMoveBackward] = useState(false);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);
    const [moveUp, setMoveUp] = useState(false);
    const [moveDown, setMoveDown] = useState(false);
    const [moveSpeed, setMoveSpeed] = useState(0.01); // Initial movement speed

    const totalModels = 5; // Total number of models available

    const handleNext = () => {
        setModelIndex((prevIndex) => (prevIndex + 1) % totalModels);
    };

    const handlePrevious = () => {
        setModelIndex((prevIndex) => (prevIndex - 1 + totalModels) % totalModels);
    };

    useEffect(() => {
        setModelPath(`/models/batch_${modelIndex}.glb`); // Update model path based on index
    }, [modelIndex]);

    return (
        <div className='' style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                }}
            >
                <button onClick={handlePrevious} style={{ marginRight: '10px' }}>
                    Previous
                </button>
                <button onClick={handleNext} style={{ marginRight: '10px' }}>
                    Next
                </button>
                <label style={{ marginLeft: '10px' }}>Movement Speed: </label>
                <input
                    type="range"
                    min="0.005"
                    max="0.1"
                    step="0.001"
                    value={moveSpeed}
                    onChange={(e) => setMoveSpeed(parseFloat(e.target.value))}
                    style={{ marginLeft: '10px' }}
                />
            </div>
            <Canvas style={{ width: '100%', height: '100%', margin: 0 }}>
                <ambientLight intensity={1.0} /> {/* Increase ambient light intensity */}
                <pointLight position={[0, 5, 0]} intensity={1.0} distance={10} decay={2} />
                <directionalLight position={[-5, 5, 5]} intensity={3} />
                <directionalLight position={[5, 5, 5]} intensity={3} />
                <directionalLight position={[5, -5, 5]} intensity={3} />
                <directionalLight position={[-5, -5, 5]} intensity={3} />
                <directionalLight position={[5, 5, -5]} intensity={3} />
                <directionalLight position={[-5, 5, -5]} intensity={3} />
                <directionalLight position={[5, -5, -5]} intensity={3} />
                <directionalLight position={[-5, -5, -5]} intensity={3} />
                <Model path={modelPath} />
                <Controls 
                    moveForward={moveForward} setMoveForward={setMoveForward}
                    moveBackward={moveBackward} setMoveBackward={setMoveBackward}
                    moveLeft={moveLeft} setMoveLeft={setMoveLeft}
                    moveRight={moveRight} setMoveRight={setMoveRight}
                    moveUp={moveUp} setMoveUp={setMoveUp}
                    moveDown={moveDown} setMoveDown={setMoveDown}
                    moveSpeed={moveSpeed} // Pass moveSpeed to Controls
                />
            </Canvas>
        </div>
    );
}
