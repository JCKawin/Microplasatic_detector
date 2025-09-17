from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import json
import io
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

# Load Gemini Pro Vision model
model = genai.GenerativeModel('gemini-pro-vision')

# --- Variable Explanations ---
#
# `uploaded_image`: This variable will hold the image file sent from the frontend.
#
# `sensor_data`: This variable will hold the JSON data sent from the Raspberry Pi sensors.
#
# `image_bytes`: The raw bytes of the uploaded image.
#
# `image`: The image loaded into a Pillow Image object, ready for processing.
#
# `processed_results`: A dictionary that will store the results of your microplastic analysis.
#

@app.route('/process', methods=['POST'])
def process_data():
    """
    This endpoint receives image and sensor data, processes it, and returns the analysis results.
    """
    # 1. --- Get Image and Sensor Data ---
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    uploaded_image = request.files['image']
    sensor_data_str = request.form.get('sensor_data', '{}')

    # 2. --- Process the Image ---
    try:
        image_bytes = uploaded_image.read()
        image = Image.open(io.BytesIO(image_bytes))
        # You can access image properties like:
        # width, height = image.size
        # format = image.format
    except Exception as e:
        return jsonify({'error': f'Invalid image file: {e}'}), 400

    # 3. --- Process Sensor Data ---
    try:
        sensor_data = json.loads(sensor_data_str)
        # Example of accessing sensor data:
        # temperature = sensor_data.get('temperature')
        # humidity = sensor_data.get('humidity')
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format for sensor_data'}), 400

    # 4. --- Image Analysis with Gemini ---
    try:
        # Convert PIL Image to bytes for Gemini
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format=image.format or 'JPEG')
        img_byte_arr = img_byte_arr.getvalue()

        # Create prompt for Gemini
        prompt = """Analyze this image for potential microplastics. If you find any:
        1. Describe their location in the image
        2. Estimate their size
        3. Describe their characteristics (shape, color, etc.)
        4. Assess confidence level of detection
        Format the response as JSON with the following structure:
        {
            "detections": [
                {
                    "location": "description of location",
                    "size": "estimated size",
                    "characteristics": "shape, color, etc",
                    "confidence": confidence level from 0-1
                }
            ]
        }"""

        # Generate response from Gemini
        response = model.generate_content([prompt, img_byte_arr])
        analysis = json.loads(response.text)

        # Process results
        processed_results = {
            'microplastics_detections': analysis.get('detections', []),
            'sensor_data_received': sensor_data
        }

    except Exception as e:
        return jsonify({'error': f'YOLOv5 inference failed: {e}'}), 500

    # 5. --- Return the Results ---
    return jsonify(processed_results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
