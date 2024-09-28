import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ videoSrc, currentTime, onTimeUpdate, isPlaying, setDuration }) => {
    const videoRef = useRef(null);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentVideoTime = videoRef.current.currentTime;

            // Only update time if the difference is significant
            if (Math.abs(currentVideoTime - currentTime) > 0.1) {
                onTimeUpdate(currentVideoTime);
            }
        }
    };

    useEffect(() => {
        // Set the video duration in the parent component
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    }, [videoRef.current?.duration, setDuration]);

    // Synchronize the current time smoothly if needed
    useEffect(() => {
        if (videoRef.current) {
            const currentVideoTime = videoRef.current.currentTime;
            if (Math.abs(currentVideoTime - currentTime) > 0.1) {
                videoRef.current.currentTime = currentTime; // Sync only if time drift is significant
            }
        }
    }, [currentTime]);

    // Synchronize play/pause state across players
    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying && videoRef.current.paused) {
                videoRef.current.play();
            } else if (!isPlaying && !videoRef.current.paused) {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <video
                ref={videoRef}
                width="100%"
                height="auto"
                controls
                style={{ borderRadius: '10px' }}
                onTimeUpdate={handleTimeUpdate}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
