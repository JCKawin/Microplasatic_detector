'use client';

import { useState } from 'react';
import CameraComponent from '../components/CameraComponent';
import ImageUpload from '../components/ImageUpload';
import Image from 'next/image';

// --- SVG Icons ---
const FragmentIcon = () => (
  <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5M12 5l-7 7 7 7"></path></svg>
);
const FiberIcon = () => (
  <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
);
const PelletIcon = () => (
  <svg className="w-6 h-6 mr-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd"></path></svg>
);
const SuccessIcon = () => (
    <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
)


// --- Interfaces ---
interface Microplastic {
  box_2d: [number, number, number, number];
  label: string;
}

interface AnalysisSummary {
  fragment_count: number;
  fiber_count: number;
  pellet_count: number;
}

interface AnalysisResult {
  imageUrl: string;
  analysis: {
    microplastics: Microplastic[];
    summary: AnalysisSummary;
  };
  error?: string;
}

// --- Main Component ---
export default function Home() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getIconForLabel = (label: string) => {
    switch (label.toLowerCase()) {
      case 'fragment': return <FragmentIcon />;
      case 'fiber': return <FiberIcon />;
      case 'pellet': return <PelletIcon />;
      default: return null;
    }
  };

  const handleCapture = async (image: string) => {
    setCapturedImage(image);
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const result: AnalysisResult = await response.json();
      if (response.ok) {
        setAnalysisResult(result);
      } else {
        setErrorMessage(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setErrorMessage('Failed to connect to the analysis service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        handleCapture(canvas.toDataURL('image/jpeg'));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleTryAgain = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  return (
    <main className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white'>
      <div className='w-full max-w-6xl mx-auto'>
        <header className='text-center mb-8'>
          <h1 className='text-4xl md:text-5xl font-extrabold'>Microplastic Detector</h1>
          <p className='mt-4 text-lg text-gray-400'>AI-powered analysis of water samples.</p>
        </header>

        {!capturedImage ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            <div className='card bg-base-200 shadow-xl p-6'>
              <h2 className='text-2xl font-bold text-center mb-4'>Use Camera</h2>
              <CameraComponent onCapture={handleCapture} />
            </div>
            <ImageUpload onUpload={handleUpload} />
          </div>
        ) : (
          <div className='card max-w-4xl mx-auto'>
            <div className='flex flex-col items-center'>
              <div className="relative w-full">
                <Image
                  src={capturedImage}
                  alt='User-provided image for analysis'
                  width={800} height={600} layout="responsive"
                  className='rounded-lg shadow-2xl'
                />
                {analysisResult?.analysis?.microplastics.map((p, i) => {
                  const [xmin, ymin, xmax, ymax] = p.box_2d;
                  return (
                    <div key={i} className="absolute border-2 border-red-500 bg-red-500/20" style={{ left: `${xmin * 100}%`, top: `${ymin * 100}%`, width: `${(xmax - xmin) * 100}%`, height: `${(ymax - ymin) * 100}%` }}>
                      <span className="bg-red-500 text-white text-xs font-semibold absolute -top-5 left-0 px-1 rounded-sm">{p.label}</span>
                    </div>
                  );
                })}
              </div>

              {isLoading && (
                  <div className='mt-8 text-center'>
                      <p className='text-xl text-gray-300 mb-2'>Analyzing Image...</p>
                      <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
                  </div>
              )}

              {errorMessage && (
                  <div className="mt-8 text-center bg-red-900/50 p-6 rounded-lg shadow-lg">
                      <h2 className="font-bold text-xl text-red-300">Analysis Failed</h2>
                      <p className="text-red-400 mt-2">{errorMessage}</p>
                  </div>
              )}

              {analysisResult && (
                <div className='mt-8 w-full bg-base-200 p-6 rounded-lg shadow-xl'>
                  <h2 className='text-3xl font-bold text-center mb-6'>Analysis Complete</h2>
                  <div className="grid grid-cols-3 gap-4 text-center mb-8 border-b border-gray-700 pb-6">
                    <div>
                      <p className="text-4xl font-bold text-blue-400">{analysisResult.analysis.summary.fragment_count}</p>
                      <p className="text-sm text-gray-400">Fragments</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-green-400">{analysisResult.analysis.summary.fiber_count}</p>
                      <p className="text-sm text-gray-400">Fibers</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-purple-400">{analysisResult.analysis.summary.pellet_count}</p>
                      <p className="text-sm text-gray-400">Pellets</p>
                    </div>
                  </div>

                  {analysisResult.analysis.microplastics.length > 0 ? (
                    <ul className="space-y-3">
                      {analysisResult.analysis.microplastics.map((plastic, index) => (
                        <li key={index} className="bg-gray-800/50 p-3 rounded-lg flex items-center shadow">
                          {getIconForLabel(plastic.label)}
                          <span className="font-medium">{plastic.label} Detected</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                        <SuccessIcon />
                        <h3 className="text-xl font-semibold mt-4 text-green-400">Clean Sample!</h3>
                        <p className="text-gray-400 mt-2">No microplastics were detected in your sample.</p>
                    </div>
                  )}
                </div>
              )}

              {(analysisResult || errorMessage) && (
                <div className='mt-8 text-center'>
                  <button onClick={handleTryAgain} className='btn btn-primary btn-lg'>Analyze Another Sample</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
