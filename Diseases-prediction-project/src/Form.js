import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Form.css';



const Form = () => {
  const [formData, setFormData] = useState({
    symptoms: '',
  });
  const [prediction, setPrediction] = useState({
    disease: '',
    confidence: 0,
    precautions: [],
  });
  const [isPredicted, setIsPredicted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.symptoms.trim()) {
      setError('Please enter symptoms before predicting');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: formData.symptoms }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setPrediction({
        disease: data.disease || '',
        confidence: data.confidence || 0,
        precautions: data.precautions || [],
      });
      setIsPredicted(true);
    } catch (err) {
      setError('Error connecting to the server. Please try again later.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ symptoms: '' });
    setPrediction({ disease: '', confidence: 0, precautions: [] });
    setIsPredicted(false);
    setError('');
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-blue-50 mt-60 shadow-l">
      <div className="w-full max-w-2xl p-6 border-2 border-blue-300 rounded-lg bg-blue-50 shadow-md mt-60">
        <h1 className="mb-6 text-3xl font-bold text-center text-blue-800">
          SYMPTOMS BASED DISEASE PREDICTION
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="symptoms" className="block mb-2 text-sm font-medium text-blue-800">
              ENTER THE SYMPTOMS (separated by ,)
            </label>
            <input
              type="text"
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              placeholder="e.g. Persistent cough, Mucus production, Fatigue"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-describedby="symptoms-help"
            />
            <p id="symptoms-help" className="mt-1 text-xs text-gray-500">
              List all symptoms you are experiencing, separated by commas
            </p>
          </div>
          
          {error && (
            <div className="p-3 text-center text-red-700 bg-red-100 border border-red-300 rounded">
              {error}
            </div>
          )}
          
          <div className="flex justify-center gap-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 font-medium text-white transition-colors bg-blue-700 rounded-md hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "PREDICTING..." : "PREDICT"}
            </button>
            
            {isPredicted && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 font-medium text-blue-700 transition-colors bg-white border border-blue-700 rounded-md hover:bg-blue-50"
              >
                RESET
              </button>
            )}
          </div>
        </form>
        
        {isPredicted && (
          <div className="mt-8 space-y-4 border-t-2 border-blue-200 pt-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-800">
                DISEASE PREDICTED
              </label>
              <div className="w-full p-3 bg-white border border-gray-300 rounded">
                {prediction.disease}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-blue-800">
                  Confidence Level
                </label>
                <div className="w-1/3 p-3 bg-white border border-gray-300 rounded text-center">
                {parseFloat(prediction.confidence).toFixed(2)}                </div>
              </div>
              <p className={`mt-1 text-sm ${prediction.confidence > 0.5 ? 'text-green-600' : 'text-yellow-600'}`}>
                {prediction.confidence > 0.5 
                  ? 'Confidence score is greater than 0.5' 
                  : 'Low confidence, please consult a doctor'}
              </p>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-800">
                PRECAUTIONS
              </label>
              {Array.isArray(prediction.precautions) && prediction.precautions.length > 0 ? (
                <ul className="p-3 bg-white border border-gray-300 rounded list-disc pl-8 text-blue-700">
                  {prediction.precautions.map((precaution, index) => (
                    <li key={index} className="mb-1">{precaution}</li>
                  ))}
                </ul>
              ) : (
                <div className="w-full p-3 bg-white border border-gray-300 rounded">
                  No specific precautions provided
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-6 p-3 text-center text-red-600 bg-red-50 border border-red-200 rounded">
          <p className="font-medium">Reminder: This is an automated prediction system.</p>
          <p>Always consult healthcare professionals for proper diagnosis and treatment.</p>
        </div>
      </div>
    </div>
  );
};

export default Form;