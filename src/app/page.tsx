'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Camera from '../components/Camera';
import Results from '../components/Results';

const HomePage: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (image: string) => {
    setCapturedImage(image);
  };

  return (
    <div className="container">
      <Header />
      <main>
        <Camera onCapture={handleCapture} />
        <Results capturedImage={capturedImage} />
      </main>
    </div>
  );
};

export default HomePage;
