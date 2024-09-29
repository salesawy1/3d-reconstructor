import React, { useState, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import './App.css';

const videosDir = '/videos';
const videoSrcs = [
  `${videosDir}/adhav_ipad.mp4`,
  `${videosDir}/adhav_iphone.mp4`,
  `${videosDir}/nathan_phone.mp4`,
  `${videosDir}/patrick_phone.mp4`,
  `${videosDir}/saif_iphone.mp4`,
];

const CamerasView = ({ view, setView }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const mainVideoRef = useRef(null);
  const videoRefs = useRef([]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      mainVideoRef.current.play();
      videoRefs.current.forEach((video) => video && video.play());
    } else {
      mainVideoRef.current.pause();
      videoRefs.current.forEach((video) => video && video.pause());
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const handleSeek = (event) => {
    const time = Number(event.target.value);
    setCurrentTime(time);
    mainVideoRef.current.currentTime = time;
    videoRefs.current.forEach((video) => video && (video.currentTime = time));
  };

  const updateDuration = (videoDuration) => {
    if (videoDuration > duration) {
      setDuration(videoDuration);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ textAlign: 'left' }}>2D CAMERA VIEW</h1>
          <h2 style={{ textAlign: 'left' }}>
            <em>{Date()}</em>
          </h2>
        </div>
        <button
          style={{
            fontSize: '1.5rem',
            alignSelf: 'left',
            marginRight: '10px',
          }}
          onClick={() => setView(view === '3d' ? 'camera' : '3d')}
        >
          View 3D Reconstruction
        </button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            width: '60%',
          }}
        >
          <VideoPlayer
            videoSrc={`${videosDir}/nathan_computer.mp4`}
            currentTime={currentTime}
            onTimeUpdate={handleTimeUpdate}
            isPlaying={isPlaying}
            setDuration={updateDuration}
            ref={mainVideoRef}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0.1rem 0',
              padding: '0.5rem',
              backgroundColor: 'rgb(40, 50, 65)',
              borderRadius: '10px',
            }}
          >
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
        <div
          style={{
            width: '42%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
          }}
        >
          {videoSrcs.map((videoSrc, index) => (
            <div
              style={{
                width: '50%',
              }}
              key={index}
            >
              <VideoPlayer
                videoSrc={videoSrc}
                currentTime={currentTime}
                onTimeUpdate={handleTimeUpdate}
                isPlaying={isPlaying}
                ref={(el) => (videoRefs.current[index] = el)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CamerasView;
