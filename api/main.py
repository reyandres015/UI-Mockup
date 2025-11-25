from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import pandas as pd
from typing import List

# ----------------------------------------------------
# 1. INICIALIZACIÓN Y CARGA DE MODELOS (AJUSTADA)
# ----------------------------------------------------
app = FastAPI(
    title="API Integral ML (Supervisado, No Supervisado, Refuerzo)",
    description="Implementación unificada de los 3 modelos de aprendizaje."
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variables globales para los modelos
knn_model = None         # Modelo Supervisado
scaler_general = None    # Scaler General
kmeans_model = None      # Modelo No Supervisado (Clustering/Estados)
q_table = None           # Tabla Q (Refuerzo)
policy_labels = ['Bajo Valor', 'Medio Valor', 'Alto Valor']  # 0, 1, 2

# Definición de las 7 features usadas por el RL/KMeans (necesarias para la extracción)
RL_FEATURES = [
    'price', 'freight_value', 'payment_installments', 'payment_value',
    'product_photos_qty', 'product_weight_g', 'product_description_lenght'
]

ALL_FEATURES = [
    'price',
    'freight_value',
    'product_name_lenght',
    'product_description_lenght',
    'product_photos_qty',
    'product_weight_g',
    'product_length_cm',
    'product_height_cm',
    'product_width_cm',
    'payment_sequential',
    'payment_installments',
    'payment_value'
]


def load_models():
    """Carga los 4 archivos de modelos y el scaler."""
    global knn_model, scaler_general, scaler_rl, kmeans_model, q_table
    try:
        # Carga 1: Modelo Supervisado (KNN)
        knn_model = joblib.load('modelo_supervisado_prediccion.pkl')

        # Carga 2: Scaler General
        scaler_general = joblib.load('scaler_general.pkl')
        # Scaler específico para RL (7 features)
        scaler_rl = joblib.load('scaler_rl.pkl')

        # Carga 3: Modelo No Supervisado (K-Means para los 8 estados)
        kmeans_model = joblib.load('modelo_nosupervisado_cluster.pkl')

        # Carga 4: Q-Table (Refuerzo)
        q_table = np.load('q_table_agente_rl.npy')

        print("✅ TODOS los 4 componentes de IA cargados exitosamente.")
    except FileNotFoundError as e:
        print(f"❌ Error: Archivo de modelo no encontrado - {e}.")
        print("Asegúrate de que los 4 archivos .pkl/.npy estén en el mismo directorio.")
    except Exception as e:
        print(f"❌ Error inesperado al cargar modelos: {e}")


# Ejecutar la carga al iniciar el API
load_models()

# ----------------------------------------------------
# 2. DEFINICIÓN DEL MODELO DE DATOS (Las 12 Variables)
# ----------------------------------------------------
# Definimos el modelo para las 12 features (el conjunto más grande),
# que será lo que Angular envíe.


class DatosEntradaIntegral(BaseModel):
    price: float
    freight_value: float
    product_name_lenght: float
    product_description_lenght: float
    product_photos_qty: float
    product_weight_g: float
    product_length_cm: float
    product_height_cm: float
    product_width_cm: float
    payment_sequential: int
    payment_installments: int
    payment_value: float

# ----------------------------------------------------
# 3. ENDPOINT INTEGRAL (Recomendación de Refuerzo)
# ----------------------------------------------------
# Este endpoint usa el K-Means y el Q-Table para recomendar una acción


@app.post("/agente/recomendar-precio/")
def recomendar_accion_rl(datos: DatosEntradaIntegral):
    """Procesa 7 features con K-Means y Q-Table para recomendar una acción de precio."""
    if q_table is None or kmeans_model is None or scaler_general is None:
        return {"error": "El Agente de Refuerzo o sus dependencias no están cargados."}

    # 1. Extraer SOLO las 7 features que necesita el RL/KMeans
    
    input_rl = [getattr(datos, feature) for feature in RL_FEATURES]

    # 2. Escalar los datos usando el scaler cargado
    features_rl_array = np.array([input_rl])
    features_scaled = scaler_rl.transform(features_rl_array)
    # 3. Asignar Estado (Modelo No Supervisado)
    estado_asignado = kmeans_model.predict(features_scaled)[0]

    # 4. Obtener la Acción Óptima (Modelo de Refuerzo)
    best_action_index = np.argmax(q_table[estado_asignado])
    q_value = q_table[estado_asignado, best_action_index]

    recomendacion_texto = policy_labels[best_action_index]

    return {
        "status": "success",
        "estado_cliente_id": int(estado_asignado),
        "accion_recomendada": recomendacion_texto,
        "interpretacion_accion": f"El agente recomienda una estrategia de '{recomendacion_texto}' para el precio.",
        "recompensa_esperada": round(q_value, 4)
    }

# ----------------------------------------------------
# 4. ENDPOINT DE PREDICCIÓN (Supervisado - 12 Features)
# ----------------------------------------------------


@app.post("/modelo/predecir-supervisado/")
def predecir_supervisado(datos: DatosEntradaIntegral):
    """Procesa las 12 features para una predicción supervisada."""
    if knn_model is None or scaler_general is None:
        return {"error": "El modelo supervisado no está cargado."}

    # 1. Obtener los valores en el ORDEN CORRECTO (usando ALL_FEATURES)
    # Esto garantiza que el DataFrame tenga el orden esperado por scaler_general.
    input_data_ordered = {
        col: [getattr(datos, col)] for col in ALL_FEATURES
    }

    # 2. Crear DataFrame con el ORDEN FORZADO
    input_df = pd.DataFrame(input_data_ordered, columns=ALL_FEATURES)

    # 3. Escalar los 12 datos usando el SCALER_GENERAL
    features_scaled = scaler_general.transform(input_df)

    # 4. Realizar predicción
    prediccion = knn_model.predict(features_scaled)[0]

    resultado_texto = "Éxito de Venta/Entrega Anticipado (Clase 1)" if prediccion == 1 else "Riesgo o Comportamiento Típico (Clase 0)"

    return {
        "status": "success",
        "prediccion_clase": int(prediccion),
        "mensaje": resultado_texto
    }
