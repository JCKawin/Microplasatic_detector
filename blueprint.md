
# Microplastic Detector Blueprint

## Overview

This application is a tool for identifying microplastics in water samples. Users can capture an image of a water sample using their device's camera or by uploading a file. The image is then analyzed by a backend service that uses the Google Gemini API to detect and classify microplastics. The results, including bounding boxes and labels for each detected particle, are overlaid on the original image, providing a clear visual analysis.

## Project Outline & Features

### Core Functionality
- **Image Capture:** Users can capture images directly through their browser using `react-webcam`.
- **Image Upload:** Users can upload existing image files from their device.
- **AI-Powered Analysis:** The backend uses the Gemini 1.5 Flash model to analyze the image for microplastics.
- **Result Visualization:** Detected microplastics are highlighted with bounding boxes and labels on the image.
- **Retake/Try Again:** Users can easily start over with a new image.
- **Firebase Integration:** The project is configured to use Firebase services.

### Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes (Node.js)
- **AI:** Google Gemini API
- **Camera:** `react-webcam`
- **Cloud Services:** Firebase

### Design & Style
- **Theme:** Dark, modern, and clean.
- **Layout:** Centered, responsive layout that adapts to different screen sizes.
- **Components:**
    - **Header:** Large, bold title with a descriptive subtitle.
    - **Input Cards:** The initial view presents two main options (Camera and Upload) in a clear, card-based layout.
    - **Buttons:** Styled with a consistent theme ("btn-primary" for main actions, "btn-secondary" for secondary actions).
    - **Analysis View:** The captured image is displayed prominently, with analysis results overlaid. A loading spinner indicates when analysis is in progress.

## Current Plan & Steps

The following changes have been implemented to improve the application's functionality, accuracy, and user experience:

1.  **Remove Placeholder Feature:**
    - Deleted the non-functional `ConnectDevice.tsx` component.
    - Updated the main page (`page.tsx`) to remove the "Connect Device" card.
    - Adjusted the layout to a two-column grid for the remaining "Camera" and "Upload" options.

2.  **Fix Camera Implementation:**
    - Installed the `react-webcam` library to provide a reliable cross-browser camera component.
    - Replaced the previous manual camera implementation in `CameraComponent.tsx` with the `<Webcam>` component.
    - Added "Capture" and "Retake" functionality for a better user experience.

3.  **Improve Analysis Accuracy:**
    - Updated the backend API route (`/api/analyze-image/route.ts`).
    - Implemented a more detailed and specific prompt for the Gemini API, instructing it to act as a microplastic detection expert and return a structured JSON response.
    - Added robust error handling to gracefully manage invalid or unexpected responses from the API.

4.  **Code Cleanup & Optimization:**
    - Resolved all linting warnings.
    - Fixed an unused variable warning in the backend API route.
    - Replaced the standard `<img>` tag with the optimized `next/image` component in `CameraComponent.tsx` to improve image loading performance.

5. **Firebase Integration:**
    - Added the necessary configuration to enable Firebase in the project.
