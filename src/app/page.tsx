'use client';

import { useState } from 'react';
import CameraComponent from '../components/CameraComponent';
import ImageUpload from '../components/ImageUpload';
import ConnectDevice from '../components/ConnectDevice';
import Image from 'next/image';

interface Microplastic {
  box_2d: [number, number, number, number];
  label: string;
}

interface AnalysisResult {
  imageUrl: string;
  analysis: {
    microplastics: Microplastic[];
  };
}

export default function Home() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCapture = async (image: string) => {
    setCapturedImage(image);
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target?.result as string;
      handleCapture(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleTryAgain = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  return (
    <main className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='w-full max-w-6xl mx-auto'>
        <header className='text-center mb-8'>
          <h1 className='text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight'>
            Microplastic Detector
          </h1>
          <p className='mt-4 text-lg md:text-xl text-gray-400'>
            Your tool for identifying microplastics in water samples.
          </p>
        </header>

        {!capturedImage ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start'>
            <div className='card bg-base-200 shadow-xl flex flex-col items-center p-6'>
              <h2 className='text-xl md:text-2xl font-bold text-white mb-4'>Use Your Camera</h2>
              <p className='text-gray-400 mb-6 text-center'>
                Capture an image directly with your computer&apos;s camera.
              </p>
              <CameraComponent onCapture={handleCapture} />
            </div>
            <ImageUpload onUpload={handleUpload} />
            <ConnectDevice />
          </div>
        ) : (
          <div className='card max-w-2xl mx-auto'>
            <div className='flex flex-col items-center'>
              <div className="relative">
                <Image
                  src={capturedImage}
                  alt='Captured image'
                  width={600}
                  height={450}
                  className='rounded-lg shadow-lg'
                />
                 {analysisResult &&
                  analysisResult.analysis &&
                  analysisResult.analysis.microplastics.map((plastic, index) => {
                    const [xmin, ymin, xmax, ymax] = plastic.box_2d;
                    const style = {
                      left: `${xmin * 100}%`,
                      top: `${ymin * 100}%`,
                      width: `${(xmax - xmin) * 100}%`,
                      height: `${(ymax - ymin) * 100}%`,
                    };
                    return (
                      <div
                        key={index}
                        className="absolute border-2 border-red-500"
                        style={style}
                      >
                        <span className="bg-red-500 text-white text-xs absolute -top-4 left-0">
                          {plastic.label}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {isLoading && (
                <div className='mt-6 text-center'>
                  <p className='text-lg text-gray-300'>Analyzing...</p>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mt-2'></div>
                </div>
              )}
              {analysisResult && (
                <div className='mt-6 w-full'>
                  <h2 className='text-2xl md:text-3xl font-bold text-white text-center mb-4'>
                    Analysis Result
                  </h2>
                  {analysisResult.analysis && analysisResult.analysis.microplastics.length > 0 ? (
                    <ul className="list-disc list-inside text-lg text-gray-300">
                      {analysisResult.analysis.microplastics.map((plastic, index) => (
                        <li key={index}>{plastic.label}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-gray-300 text-center">No microplastics detected.</p>
                  )}
                  <div className='mt-8 text-center'>
                    <button onClick={handleTryAgain} className='btn btn-primary'>
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
