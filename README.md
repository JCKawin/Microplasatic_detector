# Portable Microplastic Detector

A compact device that detects and classifies microplastics using computer vision and spectroscopy.

## What it does
- Detects microplastics in water samples
- Classifies microplastic types
- Provides count and analysis results
- Works with a mobile-friendly web interface

## Hardware
- Raspberry Pi 4
- High-res camera
- 6 LED array
- Laser sensor
- Raman spectroscopy sensor
- USB-C connection

## Software
Frontend:
- Next.js web app
- Works in any browser
- Real-time analysis

Backend:
- Python + Flask
- YOLOv5 detection model
- Image processing

## Quick Start

1. Set up hardware:
```bash
Connect Raspberry Pi via USB-C
Ensure all sensors are connected
Power on the device
```

2. Start backend:
```bash
pip install -r requirements.txt
cd backend
python app.py
```

3. Start frontend:
```bash
npm install
npm run dev
```

4. Use the device:
- Open web app in browser
- Place sample under camera
- Click to analyze
- View results

## Requirements
- Python 3.10+
- Node.js 16+
- Raspberry Pi 4
- Web browser

## Files
```
/backend     - Python server code
/src         - Frontend web app
/models      - AI model files
/dataset     - Training data
```

## License
MIT License
