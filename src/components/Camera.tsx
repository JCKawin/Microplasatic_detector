'use client';

import React, { useRef, useState } from 'react';

interface CameraProps {
  onCapture: (image: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraStarted(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const capturedImage = canvas.toDataURL('image/png');
        onCapture(capturedImage);
      }
    }
  };

  return (
    <div className="camera-view">
      <video ref={videoRef} autoPlay playsInline muted style={{ display: isCameraStarted ? 'block' : 'none', maxWidth:'100%' }} />
      {!isCameraStarted && <p>Press "Start Camera" to begin.</p>}
      <div style={{ marginTop: '1rem' }}>
        {!isCameraStarted ? (
          <button className="btn" onClick={startCamera}>
            Start Camera
          </button>
        ) : (
          <button className="btn" onClick={captureImage}>
            Capture Image
          </button>
        )}
      </div>
    </div>
  );
};

export default Camera;
