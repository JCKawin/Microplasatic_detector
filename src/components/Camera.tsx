'use client';

import React, { useRef, useState } from 'react';

interface CameraProps {
  onCapture: (image: string, detections: any) => void;
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

  const captureImage = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const capturedImage = canvas.toDataURL('image/png');

        // Send image to backend
        const formData = new FormData();
        formData.append('image', dataURItoBlob(capturedImage), 'image.png');
        formData.append('sensor_data', JSON.stringify({ /* Add any sensor data here if available */ }));

        try {
          const response = await fetch('http://localhost:5001/process', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          onCapture(capturedImage, result.microplastics_detections);
        } catch (error) {
          console.error('Error sending image to backend:', error);
          onCapture(capturedImage, []); // Pass empty array on error
        }
      }
    }
  };

  // Helper function to convert data URI to Blob
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
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
