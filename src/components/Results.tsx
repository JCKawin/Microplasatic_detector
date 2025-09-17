import React from 'react';

interface ResultsProps {
  capturedImage: string | null;
}

const Results: React.FC<ResultsProps> = ({ capturedImage }) => {
  return (
    <div className="results">
      <h2>Analysis Results</h2>
      {capturedImage ? (
        <div>
          <p>Analysis of the captured image:</p>
          <img src={capturedImage} alt="Captured for analysis" style={{ maxWidth: '100%', marginTop: '1rem' }} />
          {/* Placeholder for analysis results */}
          <p style={{ marginTop: '1rem' }}>Microplastics detected: <strong>5</strong></p>
        </div>
      ) : (
        <p>Results will be shown here after capturing an image.</p>
      )}
    </div>
  );
};

export default Results;
