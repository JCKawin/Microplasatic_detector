
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
