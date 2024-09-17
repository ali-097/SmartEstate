from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

# Load the model and ColumnTransformer
knn_regressor = pickle.load(open('KNN_model.pkl', 'rb'))
ct = pickle.load(open('ct.pkl', 'rb'))

@app.route('/predict-price', methods=['POST'])
def predict():
    try:
        # Extract data from request
        data = request.json
        property_type = data.get('property_type')
        location = data.get('location')
        city = data.get('city')
        baths = int(data.get('baths', 0))
        purpose = data.get('purpose')
        bedrooms = int(data.get('bedrooms', 0))
        area_in_marlas = float(data.get('area_in_marlas', 0.0))

        # Prepare the input data as a DataFrame
        user_input = pd.DataFrame([[property_type, location, city, baths, purpose, bedrooms, area_in_marlas]],
                                  columns=['property_type', 'location', 'city', 'baths', 'purpose', 'bedrooms', 'Area_in_Marla'])
        
        # Transform the input data
        user_input_transformed = ct.transform(user_input)

        # Predict the price
        predicted_price = knn_regressor.predict(user_input_transformed)
        
        return jsonify({'predicted_price': round(predicted_price[0], 2)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

vectoriser = pickle.load(open('vectoriser.pkl', 'rb'))
lr_classifier = pickle.load(open('LRmodel.pkl', 'rb'))

@app.route('/predict-sentiment', methods=['POST'])
def predict_sentiment():
    try:
        #Extract data from request
        data = request.json
        review = data.get('review')

        #Predict the sentiment
        review_vectorized = vectoriser.transform([review])
        sentiment = lr_classifier.predict(review_vectorized)[0]

        #Return the result
        sentiment = str(sentiment)        
        return jsonify({'sentiment': sentiment})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
