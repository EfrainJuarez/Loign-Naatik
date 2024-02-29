# train_model.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV
import xgboost
import pickle

# Cargar el conjunto de datos
dataset = pd.read_csv('d:/TEC/Practicas Naatik/IA/dataTelco.csv')
util_dataset = dataset.drop('customerID', axis=1)

# Aplicar LabelEncoder a las variables categóricas
label_encoder_dict = {}
for column in util_dataset.columns:
    if util_dataset[column].dtype == object:
        le = LabelEncoder()
        util_dataset[column] = le.fit_transform(util_dataset[column])
        label_encoder_dict[column] = le
print("------------", label_encoder_dict)
# Separar características y etiquetas
X = util_dataset.drop('Churn', axis=1)
y = util_dataset['Churn']
print("------", util_dataset['Churn'].unique())

# Escalar las características
X = StandardScaler().fit_transform(X)

# Dividir el conjunto de datos en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=1)

# Entrenar el modelo XGBoost con búsqueda de hiperparámetros
xgb = xgboost.XGBClassifier()
parameters = {
    'nthreads': [1],
    'objective': ['binary:logistic'],
    'learning_rate': [0.1],
    'n_estimators': [400]
}
fit_params = {
    'early_stopping_rounds': 10,
    'eval_metric': 'logloss',
    'eval_set': [(X_test, y_test)]
}
clf = GridSearchCV(xgb, parameters, cv=3, scoring='accuracy')
clf.fit(X_train, y_train, **fit_params)

# Verificar etiquetas únicas en las predicciones
print("Etiquetas únicas en las predicciones:", np.unique(clf.predict(X_train)))
# Guardar el modelo y el preprocesador
with open('modelo_xgboost.pkl', 'wb') as model_file:
    pickle.dump(clf.best_estimator_, model_file)

with open('label_encoder.pkl', 'wb') as label_encoder_file:
    pickle.dump(label_encoder_dict, label_encoder_file)
