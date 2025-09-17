# Project Blueprint: Microplastic Detector

## Overview

A mobile-first web application that uses a device's camera to detect and analyze microplastics in water samples. The application will provide real-time analysis and display results in a user-friendly interface.

## Features & Design

### Core Functionality
- **Camera Access:** The application will request access to the user's camera to capture images of water samples.
- **Image Analysis:** Captured images will be processed to identify microplastics. (Initially, this will be a placeholder feature).
- **Results Display:** The analysis results will be displayed to the user, including a summary and a visual representation of the detected microplastics.

### Design
- **Theme:** A modern, dark theme with blue and green accents to reflect the marine and environmental nature of the application.
- **Typography:** A clean and readable font combination using Google Fonts.
- **Layout:** A responsive, mobile-first layout that ensures a seamless experience on all devices.
- **Components:**
    - **Header:** A fixed header with the application title.
    - **Camera View:** A component that displays the camera feed and a button to capture an image.
    - **Results Section:** A section to display the analysis results.

### AI Image Recognition with YOLOv5 PyTorch
- **Backend Integration:** Implement a Flask backend to receive image data from the frontend.
- **YOLOv5 Model:** Integrate a pre-trained YOLOv5 PyTorch model for microplastic detection.
- **Inference and Results:** Run inference on the captured images and send the detection results back to the frontend.

## Plan

1.  **Initial Setup:**
    *   Create a `blueprint.md` file.
    *   Update `src/app/page.tsx` with a basic structure.
    *   Update `src/app/layout.tsx` to include Google Fonts and basic styling.
2.  **Create Components:**
    *   Create a `components` directory.
    *   Create a `Header.tsx` component.
    *   Create a `Camera.tsx` client component to handle camera access and image capture.
    *   Create a `Results.tsx` component to display the analysis results.
3.  **Styling:**
    *   Update `src/app/globals.css` with a dark theme, custom fonts, and component-specific styles.
4.  **Implement Functionality:**
    *   Add camera access logic to the `Camera.tsx` component.
    *   Add image capture functionality.
    *   Implement a placeholder for the image analysis.
    *   Display the captured image and analysis results.
5.  **Implement AI Image Recognition:**
    *   Update `blueprint.md`: Document the plan for integrating YOLOv5 PyTorch for AI image recognition in the backend and displaying results in the frontend.
    *   Update `backend/requirements.txt`: Add necessary Python packages: `torch`, `torchvision`, `Pillow`, `flask`, `flask-cors`, and `ultralytics`.
    *   Implement `backend/app.py`: Set up a Flask server, create an endpoint to receive image data, load the YOLOv5 model, run inference, and return results.
    *   Install Python Packages: Install the packages listed in `requirements.txt`.
    *   Modify `src/components/Camera.tsx`: Update the component to send captured image data to the backend.
    *   Modify `src/components/Results.tsx`: Update the component to display image recognition results from the backend.
