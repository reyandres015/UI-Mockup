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
# -- Simulación del modelo de predicción de ventas basado en la fecha --
# Supongamos que la fecha es representada como un número flotante (por ejemplo, timestamp o día del año)
# Generamos datos sintéticos: la venta aumenta con el tiempo y tiene algo de estacionalidad y ruido

np.random.seed(42)
# Simulamos 365 días
fechas = np.linspace(1, 365, 365).reshape(-1, 1)
# Ventas simuladas: tendencia creciente + estacionalidad + ruido
ventas = 100 + 0.5 * fechas.flatten() + 20 * np.sin(2 * np.pi *
                                                    fechas.flatten() / 365) + np.random.randn(365) * 5

model = LinearRegression()
model.fit(fechas, ventas)


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
    day_of_year: float


@app.post("/predict")
def predict_and_decide(state: State):
    """
    Endpoint que predice las ventas en función de la fecha proporcionada.
    """
    # Preparar los datos de entrada para el modelo
    input_features = np.array([[state.day_of_year]])

    # Realizar la predicción
    prediction = model.predict(input_features)[0]

    # Devolver la respuesta
    return APIResponse(
        code=200,
        status="success",
        message="Predicción de ventas realizada con éxito.",
        data={
            "predicted_sales": prediction
        }
    )
