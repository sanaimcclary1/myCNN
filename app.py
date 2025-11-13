from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import os

app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing

# --- Model Loading ---
MODEL_PATH = 'cvd_cnn.h5'
model = None

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        try:
            model = tf.keras.models.load_model(MODEL_PATH)
            print(f" * Model loaded successfully from {MODEL_PATH}")
        except Exception as e:
            print(f" * ERROR loading model: {e}")
    else:
        print(f" * ERROR: Model file not found at {MODEL_PATH}")

def preprocess_image(image_file):
    """
    Preprocesses the uploaded image to match the model's input
    (300x300 grayscale, normalized).
    """
    # Read the file stream and open as PIL image
    img = Image.open(io.BytesIO(image_file.read())).convert('L') # 'L' for grayscale
    
    # Resize to 300x300 (as done in the notebook)
    img = img.resize((300, 300))
    
    # Convert to numpy array
    img_array = np.array(img)
    
    # Reshape for the model: (1, 300, 300, 1)
    # (1 image, 300x300 size, 1 color channel)
    img_array = img_array.reshape((1, 300, 300, 1))
    
    # The notebook does not explicitly normalize, but Keras models
    # generally perform better with values between 0-1.
    # If your model was trained on 0-255, comment the line below.
    img_array = img_array / 255.0
    
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model is not loaded.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided.'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected.'}), 400

    try:
        # Preprocess the image
        processed_image = preprocess_image(file)

        # Make prediction
        prediction = model.predict(processed_image)
        
        # Your model's output is one-hot encoded: [prob_noncovid, prob_covid]
        # We find the index with the highest probability.
        is_covid_index = 1 
        confidence = float(np.max(prediction[0]))
        predicted_class = np.argmax(prediction[0])
        
        prediction_label = 'COVID-19 Positive' if predicted_class == is_covid_index else 'COVID-19 Negative'
        
        return jsonify({
            'prediction': prediction_label,
            'confidence': confidence
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': f'Error during prediction: {e}'}), 500

if __name__ == '__main__':
    load_model() # Load the model when the server starts
    app.run(debug=True, port=5000)