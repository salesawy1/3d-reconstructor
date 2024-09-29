import React, { useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

function Model({ path }) {
    const { scene } = useLoader(GLTFLoader, path);

    useEffect(() => {
        console.log(`Loaded model from path: ${path}`);

        return () => {
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (child.material) {
                        child.material.dispose();
                    }
                }
            });
        };
    }, [scene, path]);

    const scale = 10;
    return <primitive object={scene} scale={[scale, scale, scale]} />;
}

function Controls({ moveSpeed, modelIndex, setModelIndex, totalModels }) {
    const { camera } = useThree();
    const [moveForward, setMoveForward] = useState(false);
    const [moveBackward, setMoveBackward] = useState(false);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);
    const [moveUp, setMoveUp] = useState(false);
    const [moveDown, setMoveDown] = useState(false);

    const onKeyDown = (event) => {
        switch (event.code) {
            case 'KeyW': setMoveForward(true); break;
            case 'KeyS': setMoveBackward(true); break;
            case 'KeyA': setMoveLeft(true); break;
            case 'KeyD': setMoveRight(true); break;
            case 'KeyQ': setMoveUp(true); break;
            case 'KeyE': setMoveDown(true); break;
            case 'ArrowLeft': 
                setModelIndex((prevIndex) => (prevIndex - 1 + totalModels) % totalModels);
                break;
            case 'ArrowRight':
                setModelIndex((prevIndex) => (prevIndex + 1) % totalModels);
                break;
            default: break;
        }
    };

    const onKeyUp = (event) => {
        switch (event.code) {
            case 'KeyW': setMoveForward(false); break;
            case 'KeyS': setMoveBackward(false); break;
            case 'KeyA': setMoveLeft(false); break;
            case 'KeyD': setMoveRight(false); break;
            case 'KeyQ': setMoveUp(false); break;
            case 'KeyE': setMoveDown(false); break;
            default: break;
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
        const up = new THREE.Vector3(0, 1, 0);

        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        right.crossVectors(camera.up, direction).normalize();

        if (moveForward) velocity.add(direction.clone().multiplyScalar(moveSpeed));
        if (moveBackward) velocity.add(direction.clone().multiplyScalar(-moveSpeed));
        if (moveRight) velocity.add(right.clone().multiplyScalar(-moveSpeed));
        if (moveLeft) velocity.add(right.clone().multiplyScalar(moveSpeed));
        if (moveDown) velocity.add(up.clone().multiplyScalar(moveSpeed));
        if (moveUp) velocity.add(up.clone().multiplyScalar(-moveSpeed));

        camera.position.add(velocity);
    });

    return <PointerLockControls />;
}

export default function ThreeDRender() {
    const [modelIndex, setModelIndex] = useState(0);
    const [modelPath, setModelPath] = useState(`/models/batch_${modelIndex}.glb`);
    const [moveSpeed] = useState(0.01);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedModels, setLoadedModels] = useState([]);
    const totalModels = 10;

    console.log(`Model path updated: /models/batch_${modelIndex}.glb`);

    useEffect(() => {
        console.log(`Model path updated: /models/batch_${modelIndex}.glb`);
        setModelPath(`/models/batch_${modelIndex}.glb`);
    }, [modelIndex]);

    useEffect(() => {
        const preloadModels = async () => {
            const promises = [];
            for (let i = 0; i < totalModels; i++) {
                console.log(`Preloading model ${i}`);
                promises.push(new Promise((resolve) => {
                    const loader = new GLTFLoader();
                    loader.load(`/models/batch_${i}.glb`, (gltf) => {
                        setLoadedModels((prev) => [...prev, gltf]);
                        resolve();
                    });
                }));
            }
            await Promise.all(promises);
            setIsLoading(false);
        };
        
        preloadModels();
    }, [totalModels]);

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {isLoading ? (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '24px', color: '#fff' }}>
                    Loading models...
                </div>
            ) : (
                <Canvas style={{ width: '100%', height: '100%', margin: 0 }}>
                    <ambientLight intensity={1.0} />
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
                        moveSpeed={moveSpeed}
                        modelIndex={modelIndex}
                        setModelIndex={setModelIndex}
                        totalModels={totalModels}
                    />
                </Canvas>
            )}
        </div>
    );
}