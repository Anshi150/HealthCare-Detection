

# # app.py - Flask Backend (Corrected)
# from flask import Flask, request, jsonify
# import pickle
# import numpy as np
# import pandas as pd
# from flask_cors import CORS
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.cluster import KMeans
# from sklearn.preprocessing import MultiLabelBinarizer

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Load ML model and data
# with open('prediction_model_final.pkl', 'rb') as f:
#     model_data = pickle.load(f)
#     rf_model = model_data['rf_model']
#     mlb = model_data['mlb']
#     df = model_data['df']
#     vectorizer = model_data['vectorizer']
#     kmeans = model_data['kmeans']

# def process_symptoms(symptoms_input):
#     """Process and normalize the symptom input"""
#     # Convert input to lowercase and split by commas
#     symptom_list = [s.strip().lower() for s in symptoms_input.split(',')]
#     return symptom_list

# def predict_disease_ml(symptoms_list, rf_model, mlb, df, vectorizer, kmeans):
#     """
#     Predict disease using the ML model
#     Returns: disease name, treatments, confidence score, prediction method, unknown symptoms
#     """
#     # Vectorize symptoms for prediction
#     symptoms_text = ' '.join(symptoms_list)
#     symptoms_vector = vectorizer.transform([symptoms_text])
    
#     # Make prediction
#     cluster = kmeans.predict(symptoms_vector)[0]
    
#     # Get diseases in the same cluster
#     cluster_diseases = df[df['cluster'] == cluster]['disease'].tolist()
    
#     # If no diseases found in cluster, use the entire dataset
#     if not cluster_diseases:
#         cluster_diseases = df['disease'].tolist()
    
#     # Match symptoms with known diseases
#     matched_diseases = {}
#     unknown_symptoms = []
    
#     for symptom in symptoms_list:
#         found = False
#         for disease in cluster_diseases:
#             disease_symptoms = df[df['disease'] == disease]['symptoms'].iloc[0]
#             if symptom in disease_symptoms:
#                 if disease not in matched_diseases:
#                     matched_diseases[disease] = 0
#                 matched_diseases[disease] += 1
#                 found = True
#         if not found:
#             unknown_symptoms.append(symptom)
    
#     # If no matches found, use random forest model
#     if not matched_diseases:
#         # Create binary symptom vector
#         symptom_vector = np.zeros(len(mlb.classes_))
#         for symptom in symptoms_list:
#             if symptom in mlb.classes_:
#                 idx = np.where(mlb.classes_ == symptom)[0]
#                 if len(idx) > 0:
#                     symptom_vector[idx[0]] = 1
        
#         # Make prediction
#         probs = rf_model.predict_proba([symptom_vector])[0]
#         max_prob_idx = np.argmax(probs)
#         disease = rf_model.classes_[max_prob_idx]
#         confidence = float(probs[max_prob_idx])
#         method = "random_forest"
#     else:
#         # Get the disease with the most symptom matches
#         disease = max(matched_diseases, key=matched_diseases.get)
#         total_disease_symptoms = len(df[df['disease'] == disease]['symptoms'].iloc[0])
#         confidence = float(matched_diseases[disease] / total_disease_symptoms)
#         method = "symptom_matching"
    
#     # Get treatments
#     treatments = []
#     disease_row = df[df['disease'] == disease]
#     if not disease_row.empty and 'precautions' in disease_row.columns:
#         treatments = disease_row['precautions'].iloc[0]
#         if isinstance(treatments, str):
#             treatments = [t.strip() for t in treatments.split(',')]
#     else:
#         treatments = ["Rest and hydration", "Consult a healthcare professional"]
    
#     return disease, treatments, confidence, method, unknown_symptoms

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json()
#     symptoms_input = data.get("symptoms", "")
    
#     if not symptoms_input:
#         return jsonify({"error": "No symptoms provided"}), 400
    
#     try:
#         symptom_list = process_symptoms(symptoms_input)
#         disease, treatments, confidence, method, unknowns = predict_disease_ml(
#             symptom_list, rf_model, mlb, df, vectorizer, kmeans
#         )
        
#         return jsonify({
#             "disease": disease,
#             "precautions": treatments,
#             "confidence": confidence,
#             "method": method,
#             "unknown_symptoms": unknowns
#         })
#     except Exception as e:
#         app.logger.error(f"Prediction error: {str(e)}")
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.preprocessing import MultiLabelBinarizer

app = Flask(__name__)
CORS(app)

# Load ML model and data
with open('prediction_final.pkl', 'rb') as f:
    model_data = pickle.load(f)
    rf_model = model_data['rf_model']
    mlb = model_data['mlb']
    df = model_data['df']
    vectorizer = model_data['vectorizer']
    kmeans = model_data['kmeans']

def process_symptoms(symptoms_input):
    return [s.strip().lower() for s in symptoms_input.split(',')]

def predict_disease_ml(symptoms_list, rf_model, mlb, df, vectorizer, kmeans):
    symptoms_text = ' '.join(symptoms_list)
    symptoms_vector = vectorizer.transform([symptoms_text])
    cluster = kmeans.predict(symptoms_vector)[0]

    # Get diseases in same cluster
    if 'cluster' in df.columns:
        cluster_diseases = df[df['cluster'] == cluster]['Name'].tolist()
    else:
        cluster_diseases = df['Name'].tolist()

    matched_diseases = {}
    unknown_symptoms = []

    for symptom in symptoms_list:
        found = False
        for disease in cluster_diseases:
            disease_row = df[df['Name'] == disease]
            if not disease_row.empty:
                disease_symptoms = disease_row['Symptoms'].iloc[0].lower()
                if symptom in disease_symptoms:
                    matched_diseases[disease] = matched_diseases.get(disease, 0) + 1
                    found = True
        if not found:
            unknown_symptoms.append(symptom)

    if not matched_diseases:
        symptom_vector = np.zeros(len(mlb.classes_))
        for symptom in symptoms_list:
            if symptom in mlb.classes_:
                idx = np.where(mlb.classes_ == symptom)[0]
                if len(idx) > 0:
                    symptom_vector[idx[0]] = 1
        probs = rf_model.predict_proba([symptom_vector])[0]
        max_prob_idx = np.argmax(probs)
        disease = rf_model.classes_[max_prob_idx]
        confidence = float(probs[max_prob_idx])
        method = "random_forest"
    else:
        disease = max(matched_diseases, key=matched_diseases.get)
        disease_symptoms = df[df['Name'] == disease]['Symptoms'].iloc[0].split(',')
        total_disease_symptoms = len(disease_symptoms)
        confidence = float(matched_diseases[disease] / total_disease_symptoms)
        method = "symptom_matching"

    # Get treatments
    treatments = []
    disease_row = df[df['Name'] == disease]
    if not disease_row.empty and 'Treatments' in disease_row.columns:
        treatments_raw = disease_row['Treatments'].iloc[0]
        treatments = [t.strip() for t in treatments_raw.split(',')]
    else:
        treatments = ["Rest", "Consult a doctor"]

    return disease, treatments, confidence, method, unknown_symptoms

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    symptoms_input = data.get("symptoms", "")

    if not symptoms_input:
        return jsonify({"error": "No symptoms provided"}), 400

    try:
        symptom_list = process_symptoms(symptoms_input)
        disease, treatments, confidence, method, unknowns = predict_disease_ml(
            symptom_list, rf_model, mlb, df, vectorizer, kmeans
        )
        return jsonify({
            "disease": disease,
            "precautions": treatments,
            "confidence": confidence,
            "method": method,
            "unknown_symptoms": unknowns
        })
    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)