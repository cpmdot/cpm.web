import React, { useState, useRef } from 'react';

const VideoPlayer = ({ src, poster }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error("Video play failed:", error);
      });
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);

  return (
    <div className="video-wrapper">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        controls={isPlaying} // Show controls only when playing
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
      />
      <div className="video-watermark">CPM.</div>
      
      {/* The overlay is now rendered conditionally based on the `isPlaying` state */}
      {!isPlaying && (
        <div className="video-overlay" onClick={togglePlay}>
          <button
            className="play-button wave"
            onClick={togglePlay}
            aria-label="Play video"
          >
            {/* SVG icon for Play */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;