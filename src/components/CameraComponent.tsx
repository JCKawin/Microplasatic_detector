'use client';
import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image';

interface CameraComponentProps {
  onCapture: (image: string) => void;
}

export default function CameraComponent({ onCapture }: CameraComponentProps) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Create an image element to process the captured image
      const img = document.createElement('img');
      img.src = imageSrc;
      img.onload = () => {
        // Create a canvas for resizing
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Set a maximum width for the image
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        // Draw the resized image onto the canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get the resized image as a new base64 string
        const resizedImageSrc = canvas.toDataURL('image/jpeg');

        setImgSrc(resizedImageSrc); // Update the UI with the resized image
        onCapture(resizedImageSrc); // Send the resized image for analysis
      };
    }
  }, [webcamRef, setImgSrc, onCapture]);

  const handleRetake = () => {
    setImgSrc(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {!imgSrc ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full rounded-lg shadow-lg mb-4"
            videoConstraints={{ width: 1280, height: 720 }} // Request a higher resolution
          />
          <button onClick={capture} className="btn btn-primary w-full">
            Capture
          </button>
        </>
      ) : (
        <>
          {/* Use the next/image component for the preview */}
          <div style={{ width: '100%', position: 'relative', paddingBottom: '56.25%' }}>
             <Image 
                src={imgSrc} 
                alt="Captured image" 
                layout="fill"
                objectFit="contain"
                className="rounded-lg shadow-lg mb-4" 
             />
          </div>
          <button onClick={handleRetake} className="btn btn-secondary w-full mt-4">
            Retake
          </button>
        </>
      )}
    </div>
  );
}
