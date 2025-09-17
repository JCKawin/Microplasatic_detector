
from flask import Flask, request, jsonify
from PIL import Image
import json
import io

app = Flask(__name__)

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
    #
    #    This is where you will implement your custom image processing
    #    and microplastic detection logic.
    #
    #    - You can use libraries like OpenCV, TensorFlow, or PyTorch here.
    #    - You will analyze the `image` variable.
    #    - You can use the `sensor_data` to adjust your analysis.
    #
    #    For now, we'll use a placeholder result.
    #
    detected_microplastics = {
        'count': 5,
        'types': ['Fragment', 'Fiber', 'Bead'],
        'confidence': 0.85
    }

    processed_results = {
        'microplastics': detected_microplastics,
        'sensor_data_received': sensor_data
    }

    # 5. --- Return the Results ---
    return jsonify(processed_results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
