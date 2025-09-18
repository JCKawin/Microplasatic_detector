from flask import Flask, request, jsonifyfrom flask import Flask, request, jsonify

from flask_cors import CORSfrom flask_cors import CORS

from PIL import Imagefrom PIL import Image

import torchimport json

import numpy as npimport io

import ioimport os

import jsonimport google.generativeai as genai

from ultralytics import YOLOfrom dotenv import load_dotenv



app = Flask(__name__)# Load environment variables

CORS(app)  # Enable CORS for all routesload_dotenv()



# Load YOLOv5 modelapp = Flask(__name__)

try:CORS(app)  # Enable CORS for all routes

    model = YOLO('yolov5s.pt')  # load a pretrained model

    print("Model loaded successfully!")# Configure Gemini API

except Exception as e:GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

    print(f"Error loading model: {e}")genai.configure(api_key=GOOGLE_API_KEY)



@app.route('/health', methods=['GET'])# Load Gemini Pro Vision model

def health_check():model = genai.GenerativeModel('gemini-pro-vision')

    """

    Endpoint to check if the server is running# --- Variable Explanations ---

    """#

    return jsonify({"status": "healthy", "message": "Server is running"}), 200# `uploaded_image`: This variable will hold the image file sent from the frontend.

#

@app.route('/detect', methods=['POST'])# `sensor_data`: This variable will hold the JSON data sent from the Raspberry Pi sensors.

def detect_microplastics():#

    """# `image_bytes`: The raw bytes of the uploaded image.

    Endpoint to detect microplastics in uploaded images#

    """# `image`: The image loaded into a Pillow Image object, ready for processing.

    if 'image' not in request.files:#

        return jsonify({'error': 'No image file provided'}), 400# `processed_results`: A dictionary that will store the results of your microplastic analysis.

#

    try:

        # Get the image from the request@app.route('/process', methods=['POST'])

        image_file = request.files['image']def process_data():

        image_bytes = image_file.read()    """

        image = Image.open(io.BytesIO(image_bytes))    This endpoint receives image and sensor data, processes it, and returns the analysis results.

    """

        # Perform inference    # 1. --- Get Image and Sensor Data ---

        results = model(image)    if 'image' not in request.files:

                return jsonify({'error': 'No image file provided'}), 400

        # Process results

        detections = []    uploaded_image = request.files['image']

        for r in results:    sensor_data_str = request.form.get('sensor_data', '{}')

            boxes = r.boxes

            for box in boxes:    # 2. --- Process the Image ---

                # Get box coordinates, confidence and class    try:

                x1, y1, x2, y2 = box.xyxy[0].tolist()        image_bytes = uploaded_image.read()

                confidence = float(box.conf[0])        image = Image.open(io.BytesIO(image_bytes))

                class_id = int(box.cls[0])        # You can access image properties like:

                        # width, height = image.size

                detection = {        # format = image.format

                    'bbox': [x1, y1, x2, y2],    except Exception as e:

                    'confidence': confidence,        return jsonify({'error': f'Invalid image file: {e}'}), 400

                    'class_id': class_id

                }    # 3. --- Process Sensor Data ---

                detections.append(detection)    try:

        sensor_data = json.loads(sensor_data_str)

        # Return the results        # Example of accessing sensor data:

        response = {        # temperature = sensor_data.get('temperature')

            'success': True,        # humidity = sensor_data.get('humidity')

            'detections': detections,    except json.JSONDecodeError:

            'message': f'Found {len(detections)} potential microplastics'        return jsonify({'error': 'Invalid JSON format for sensor_data'}), 400

        }

        return jsonify(response), 200    # 4. --- Image Analysis with Gemini ---

    try:

    except Exception as e:        # Convert PIL Image to bytes for Gemini

        return jsonify({        img_byte_arr = io.BytesIO()

            'success': False,        image.save(img_byte_arr, format=image.format or 'JPEG')

            'error': str(e),        img_byte_arr = img_byte_arr.getvalue()

            'message': 'Failed to process image'

        }), 500        # Create prompt for Gemini

        prompt = """Analyze this image for potential microplastics. If you find any:

@app.errorhandler(404)        1. Describe their location in the image

def not_found(error):        2. Estimate their size

    return jsonify({'error': 'Not found'}), 404        3. Describe their characteristics (shape, color, etc.)

        4. Assess confidence level of detection

@app.errorhandler(500)        Format the response as JSON with the following structure:

def internal_error(error):        {

    return jsonify({'error': 'Internal server error'}), 500            "detections": [

                {

if __name__ == '__main__':                    "location": "description of location",

    app.run(host='0.0.0.0', port=5050, debug=True)                    "size": "estimated size",
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
