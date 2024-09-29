import React, { useEffect, forwardRef } from 'react';

const VideoPlayer = forwardRef(
  ({ videoSrc, currentTime, isPlaying, onTimeUpdate, setDuration }, ref) => {
    useEffect(() => {
      if (ref && ref.current) {
        ref.current.currentTime = currentTime;
      }
    }, [currentTime, ref]);

    useEffect(() => {
      if (ref && ref.current) {
        if (isPlaying) {
          ref.current.play();
        } else {
          ref.current.pause();
        }
      }
    }, [isPlaying, ref]);

    const handleLoadedMetadata = () => {
      if (setDuration) {
        setDuration(ref.current.duration);
      }
    };

    const handleTimeUpdate = () => {
      if (onTimeUpdate && ref.current) {
        onTimeUpdate(ref.current.currentTime);
      }
    };

    return (
      <video
        ref={ref}
        src={videoSrc}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        style={{ width: '100%' }}
      />
    );
  }
);

export default VideoPlayer;
