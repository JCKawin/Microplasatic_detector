from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import json
import io
from ultralytics import YOLO

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Load YOLOv5 model
# It will download the model if not already present
model = YOLO('yolov5s.pt')

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

    # 4. --- Microplastic Detection Logic ---
    try:
        # Perform inference
        results = model(image)

        # Process results
        detected_microplastics = []
        for r in results:
            for box in r.boxes:
                # Assuming '0' is the class for microplastics, adjust if your model has different classes
                # You might need to map class IDs to actual microplastic types
                if int(box.cls[0]) == 0: # Example: if class 0 is microplastic
                    detected_microplastics.append({
                        'box': box.xyxy[0].tolist(), # Bounding box coordinates
                        'confidence': float(box.conf[0]),
                        'class': int(box.cls[0])
                    })

        processed_results = {
            'microplastics_detections': detected_microplastics,
            'sensor_data_received': sensor_data
        }

    except Exception as e:
        return jsonify({'error': f'YOLOv5 inference failed: {e}'}), 500

    # 5. --- Return the Results ---
    return jsonify(processed_results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
