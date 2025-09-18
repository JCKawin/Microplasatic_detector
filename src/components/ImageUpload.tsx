'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// --- SVG Icon for Upload ---
const UploadIcon = () => (
    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H12a4 4 0 014 4v1m-6 4h6m-3-3v6"></path></svg>
);

interface ImageUploadProps {
  onUpload: (file: File) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onUpload(file); // Automatically trigger upload on drop
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    multiple: false,
  });

  return (
    <div className='card bg-base-200 shadow-xl flex flex-col items-center p-6 text-center'>
      <h2 className='text-2xl font-bold text-white mb-4'>Upload an Image</h2>
      <div
        {...getRootProps()}
        className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? 'border-blue-500 bg-blue-900/50' : 'border-gray-600 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <UploadIcon />
        {isDragActive ? (
          <p className="mt-2 text-blue-300">Drop the image here!</p>
        ) : (
          <p className="mt-2 text-gray-400">Drag & drop an image, or click to select</p>
        )}
      </div>
      {selectedFile && (
        <p className="mt-4 text-sm text-gray-300">Selected: {selectedFile.name}</p>
      )}
    </div>
  );
}
