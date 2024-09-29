import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import './App.css';

const CamerasView = () => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [frameRate, setFrameRate] = useState(30); // default frame rate of 30 fps
    const [duration, setDuration] = useState(0); // stores video duration for the slider
    const intervalRef = useRef(null);

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
            {/* Play bar and controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
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
                    style={{ width: '300px', marginRight: '10px' }}
                />
                <label style={{ marginRight: '10px' }}>Frame Rate: </label>
                <input
                    type="number"
                    value={frameRate}
                    min={1}
                    max={60}
                    onChange={handleFrameRateChange}
                    style={{ width: '50px' }}
                />
            </div>

            {/* Video players */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: '10px',
                rowGap: '-10px'
            }}>
                <div className='video-player'>
                    <VideoPlayer
                        videoSrc="/adhav.MOV"
                        currentTime={currentTime}
                        onTimeUpdate={handleTimeUpdate}
                        isPlaying={isPlaying}
                        setDuration={setDuration}
                    />
                </div>
                <div className='video-player'>
                    <VideoPlayer
                        videoSrc="/adhav.MOV"
                        currentTime={currentTime}
                        onTimeUpdate={handleTimeUpdate}
                        isPlaying={isPlaying}
                        setDuration={setDuration}
                    />
                </div>
                <div className='video-player'>
                    <VideoPlayer
                        videoSrc="/adhav.MOV"
                        currentTime={currentTime}
                        onTimeUpdate={handleTimeUpdate}
                        isPlaying={isPlaying}
                        setDuration={setDuration}
                    />
                </div>
                <div className='video-player'>
                    <VideoPlayer
                        videoSrc="/adhav.MOV"
                        currentTime={currentTime}
                        onTimeUpdate={handleTimeUpdate}
                        isPlaying={isPlaying}
                        setDuration={setDuration}
                    />
                </div>
            </div>
        </div>
    );
};

export default CamerasView;
