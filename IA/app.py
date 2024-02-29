# app.py
from flask import Flask, request, jsonify
import pandas as pd
import pickle
from sklearn.preprocessing import StandardScaler
from flask_cors import CORS  # Importa la extensión CORS

app = Flask(__name__)
CORS(app)  # Agrega soporte CORS a la aplicación

# Cargar el objeto LabelEncoder
with open('label_encoder.pkl', 'rb') as label_encoder_file:
    label_encoder_dict = pickle.load(label_encoder_file)

# Cargar el modelo XGBoost
with open('modelo_xgboost.pkl', 'rb') as model_file:
    best_xgb = pickle.load(model_file)

    
# Ruta para realizar predicciones
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Obtén los datos de entrada desde la solicitud
        data = request.get_json(force=True)

        print(f'Datos de entrada: {data}')

        # Crea un DataFrame con una sola fila
        input_data = pd.DataFrame([data])
# Imprimir características importantes
        feature_importances = best_xgb.feature_importances_
        feature_names = input_data.columns[1:]  # Excluir 'customerID'

        for feature, importance in zip(feature_names, feature_importances):
            print(f"{feature}: {importance}")
        # Aplica preprocesamiento similar al que se hizo durante el entrenamiento
        for column in input_data.columns:
            if column != 'customerID':
                if input_data[column].dtype == 'object':
                    # Verifica si el preprocesador para la columna está disponible
                    if column in label_encoder_dict:
                        input_data[column] = label_encoder_dict[column].transform(input_data[column])
                    else:
                        return jsonify({'error': f'{column} no está en el preprocesador'})

        print('Datos después del LabelEncoder:', input_data)

        # Excluye 'customerID' antes de escalar las variables
        input_data = input_data.drop(['customerID'], axis=1)

        # Escala las variables
        input_data = StandardScaler().fit_transform(input_data)

        print('Datos escalados:', input_data)

        # Realiza la predicción
        prediction = best_xgb.predict(input_data)[0]
        print(f'Predicción: {prediction}')
        # Devuelve la predicción como JSON
        return jsonify({'prediction': float(prediction)})

    except Exception as e:
        return jsonify({'error': str(e)})


# Punto de entrada para la aplicación
if __name__ == '__main__':
    app.run(port=5000, debug=True)
