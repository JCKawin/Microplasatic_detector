import React from 'react';

interface Detection {
  box: [number, number, number, number];
  confidence: number;
  class: number;
}

interface ResultsProps {
  capturedImage: string | null;
  detections: Detection[];
}

const Results: React.FC<ResultsProps> = ({ capturedImage, detections }) => {
  return (
    <div className="results">
      <h2>Analysis Results</h2>
      {capturedImage ? (
        <div style={{ position: 'relative' }}>
          <p>Analysis of the captured image:</p>
          <img src={capturedImage} alt="Captured for analysis" style={{ maxWidth: '100%', marginTop: '1rem' }} />
          {detections.map((detection, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                border: '2px solid red',
                left: `${detection.box[0]}px`,
                top: `${detection.box[1]}px`,
                width: `${detection.box[2] - detection.box[0]}px`,
                height: `${detection.box[3] - detection.box[1]}px`,
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
                  background: 'red',
                  color: 'white',
                  padding: '2px 5px',
                  fontSize: '12px',
                  position: 'absolute',
                  top: '-20px',
                  left: '0',
                }}
              >
                Microplastic: {(detection.confidence * 100).toFixed(2)}%
              </span>
            </div>
          ))}
          <p style={{ marginTop: '1rem' }}>Microplastics detected: <strong>{detections.length}</strong></p>
        </div>
      ) : (
        <p>Results will be shown here after capturing an image.</p>
      )}
    </div>
  );
};

export default Results;
