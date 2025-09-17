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
      setImgSrc(imageSrc);
      onCapture(imageSrc);
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
          />
          <button onClick={capture} className="btn btn-primary w-full">
            Capture
          </button>
        </>
      ) : (
        <>
          <Image src={imgSrc} alt="Captured image" width={600} height={450} className="w-full rounded-lg shadow-lg mb-4" />
          <button onClick={handleRetake} className="btn btn-secondary w-full">
            Retake
          </button>
        </>
      )}
    </div>
  );
}
