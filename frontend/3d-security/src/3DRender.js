import React, { useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

// Component to load and display the OBJ model
function Model({ path }) {
    const obj = useLoader(OBJLoader, path); // Load the OBJ file

    useEffect(() => {
        return () => {
            if (obj) {
                obj.traverse((child) => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) child.material.dispose();
                });
            }
        };
    }, [obj]);

    return <primitive object={obj} />;
}

function Controls() {
    const { camera } = useThree();
    const moveSpeed = 0.1;
    const [moveForward, setMoveForward] = useState(false);
    const [moveBackward, setMoveBackward] = useState(false);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);

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

        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        right.crossVectors(camera.up, direction).normalize();

        if (moveForward) velocity.add(direction.clone().multiplyScalar(moveSpeed));
        if (moveBackward) velocity.add(direction.clone().multiplyScalar(-moveSpeed));
        if (moveLeft) velocity.add(right.clone().multiplyScalar(-moveSpeed));
        if (moveRight) velocity.add(right.clone().multiplyScalar(moveSpeed));

        camera.position.add(velocity);
    });

    return <PointerLockControls />;
}

export default function ThreeDRender() {
    const [modelPath, setModelPath] = useState('/mesh.obj');
    console.log(modelPath);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const duration = 120;

    const handlePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };

    const handleSeek = (event) => {
        const time = parseFloat(event.target.value);
        setCurrentTime(time);
    };

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime((prevTime) => {
                    const newTime = prevTime + 0.1;
                    if (newTime >= duration) {
                        clearInterval(interval);
                        setIsPlaying(false);
                        return duration;
                    }
                    return newTime;
                });
            }, 100);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying]);

    useEffect(() => {
        const filename = timeToFilename(currentTime);
        setModelPath(`/${filename}`);
    }, [currentTime]);

    function timeToFilename(time) {
        const totalMilliseconds = Math.floor(time * 1000);
        const hours = Math.floor(totalMilliseconds / (3600 * 1000));
        const minutes = Math.floor((totalMilliseconds % (3600 * 1000)) / (60 * 1000));
        const seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);
        const centiseconds = Math.floor((totalMilliseconds % 1000) / 10);

        const pad = (num) => String(num).padStart(2, '0');

        return `mesh-${pad(hours)}-${pad(minutes)}-${pad(seconds)}-${pad(centiseconds)}.obj`;
    }

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
                <button onClick={handlePlayPause} style={{ marginRight: '10px' }}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <input
                    type='range'
                    min={0}
                    max={duration}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    style={{ width: '300px', marginRight: '10px' }}
                />
            </div>
            <Canvas style={{ width: '100%', height: '100%', margin: 0 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <directionalLight position={[-5, 5, 5]} intensity={1} />
                <Model path={modelPath} />
                <Controls />
            </Canvas>
        </div>
    );
}
