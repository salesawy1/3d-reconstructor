import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import './App.css';

const CamerasView = ({view, setView}) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [frameRate, setFrameRate] = useState(30); // default frame rate of 30 fps
    const [duration, setDuration] = useState(0); // stores video duration for the slider
    const intervalRef = useRef(null);

    const [videoSrcs, setVideoSrcs] = useState(['/adhav.MOV', '/adhav.MOV', '/adhav.MOV', '/adhav.MOV',  '/nathan.MOV', '/saif.MOV'])

    // Update the video time based on the frame rate
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentTime((prevTime) => {
                    const newTime = prevTime + 1 / frameRate;
                    if (newTime >= duration) {
                        clearInterval(intervalRef.current);
                        setIsPlaying(false); // Stop when reaching the end of the video
                        return duration;
                    }
                    return newTime;
                });
            }, 1000 / frameRate);
        } else if (!isPlaying && intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isPlaying, frameRate, duration]);

    const handleTimeUpdate = (time) => {
        setCurrentTime(time);
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleFrameRateChange = (event) => {
        setFrameRate(Number(event.target.value));
    };

    const handleSeek = (event) => {
        setCurrentTime(Number(event.target.value));
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div>
                    <h1 style={{ textAlign: 'left' }}>2D CAMERA VIEW</h1>
                    <h2 style={{ textAlign: 'left' }}><em>{Date(currentTime)}</em></h2>
                </div>
                <button style={{
                    fontSize: '1.5rem', 
                    alignSelf: 'left',
                    marginRight: '10px',
                }} onClick={() => setView(view === '3d' ? 'camera' : '3d')}>
                    View 3d reconstruction
                </button>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
            }}>
                <div style={{
                    width: '60%',
                }}>
                    <VideoPlayer
                        videoSrc={'/adhav.MOV'}
                        currentTime={currentTime}
                        onTimeUpdate={handleTimeUpdate}
                        isPlaying={isPlaying}
                        setDuration={setDuration}
                    />
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0.1rem 0',
                        padding: '0.5rem',
                        backgroundColor: 'rgb(40, 50, 65)', 
                        borderRadius: '10px',
                    }}>
                        <button onClick={handlePlayPause} style={{ marginRight: '10px' }}>
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <input 
                            type="range"
                            min={0}
                            max={duration}
                            step={0.1}
                            value={currentTime}
                            onChange={handleSeek}
                            style={{ 
                                width: '100%', 
                                marginRight: '10px', 
                            }}
                        />
                    </div>
                </div>
                <div style={{
                    width: '42%',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignContent: 'flex-start',
                }}>

                    {
                        videoSrcs.map((videoSrc, index) => (
                            <div style={{
                                width: '50%'
                            }}>
                                <VideoPlayer
                                    key={index}
                                    videoSrc={videoSrc}
                                    currentTime={currentTime}
                                    onTimeUpdate={handleTimeUpdate}
                                    isPlaying={isPlaying}
                                    setDuration={setDuration}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default CamerasView;
