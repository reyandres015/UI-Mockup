from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Optional
import numpy as np
from sklearn.linear_model import LinearRegression

app = FastAPI()

# Permitir CORS (ajusta origins según sea necesario)
app.add_middleware(
    CORSMiddleware,
    # Cambia "*" por la URL de tu frontend en producción
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (POST, GET, etc.)
    allow_headers=["*"],  # Permitir todos los headers
)


# -- Simulación del modelo de Regresión Lineal --
# Se simula un modelo que usa duración del sueño, nivel de ejercicio y presión arterial.
# Un nivel de estrés más alto podría estar asociado con menos sueño, menos ejercicio o presión arterial
np.random.seed(42)
# [duración_sueño, nivel_ejercicio, presión_arterial]
X_stress = np.random.rand(100, 3) * [5, 10, 50]
y_stress = 10 - (X_stress[:, 0] * 1.5) + (X_stress[:, 1]
                                          * 0.5) + (X_stress[:, 2] * 0.1) + np.random.randn(100)
model = LinearRegression()
model.fit(X_stress, y_stress)


@app.get("/")
def read_root():
    return {"message": "API de Monitoreo de Estrés está en funcionamiento."}


class APIResponse(BaseModel):
    """
    Modelo de respuesta de la API
    """
    code: int
    status: str
    message: str
    data: Optional[dict[str, Any]] = None


class State(BaseModel):
    sleep_duration: float
    exercise_level: int
    blood_pressure: int


@app.post("/predict")
def predict_and_decide(state: State):
    """
    Endpoint que predice el nivel de estrés y determina la acción del sistema.
    """
    # Preparar los datos de entrada para el modelo
    input_features = np.array(
        [[state.sleep_duration, state.exercise_level, state.blood_pressure]])

    # Realizar la predicción
    prediction = model.predict(input_features)[0]

    # Asegurar que la predicción esté en un rango lógico (ej. 1 a 10)
    predicted_stress_level = max(1, min(10, prediction))

    # -- Lógica del flujo de decisión --
    threshold = 7.0
    is_high_stress = True if predicted_stress_level > threshold else False
    decision_action = (f"El nivel de estrés estimado es de {predicted_stress_level:.2f}. "
                       f"{'⚠ ¡Nivel Alto! Se recomienda consulta con un especialista.' if is_high_stress else '✅ Nivel Normal. Se sugiere monitoreo y hábitos saludables.'}")

    # Devolver la respuesta
    return APIResponse(
        code=200,
        status="success",
        message="Predicción realizada con éxito.",
        data={
            "predicted_stress_level": predicted_stress_level,
            "is_high_stress": is_high_stress,
            "decision_action": decision_action
        }
    )


@app.get("/consult_specialist")
def consult_specialist():
    """
    Endpoint que simula la derivación a un especialista.
    """
    return APIResponse(
        code=200,
        status="success",
        message="✔ ¡Se ha notificado al especialista para seguimiento!"
    )
