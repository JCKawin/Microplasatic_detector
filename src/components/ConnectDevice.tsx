'use client';

import { useState } from 'react';

export default function ConnectDevice() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    // In a real application, this would involve connecting to a device,
    // e.g., via Web Bluetooth, Web Serial, or a local network request.
    console.log('Attempting to connect to the device...');
    // For this placeholder, we'll just simulate a successful connection.
    setIsConnected(true);
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Connect to a Device</h2>
        <p>Connect to a Raspberry Pi or other device for sample analysis.</p>
        <div className="card-actions justify-end">
          {isConnected ? (
            <p className="text-success">Device Connected</p>
          ) : (
            <button onClick={handleConnect} className="btn btn-secondary">
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
