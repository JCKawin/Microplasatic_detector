'use client';

import { useState } from 'react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className='flex flex-col items-center card'>
      <h2 className='text-xl md:text-2xl font-bold text-white mb-4'>Upload an Image</h2>
      <p className='text-gray-400 mb-6'>
        Select an image from your computer to analyze for microplastics.
      </p>
      <div className='flex flex-col items-center w-full'>
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='mb-4 text-white'
        />
        {selectedFile && (
          <button
            onClick={handleUpload}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
}
