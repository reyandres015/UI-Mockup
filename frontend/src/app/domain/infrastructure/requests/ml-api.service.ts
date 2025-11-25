// src/app/services/ml-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosEntrada } from '../../models/datos-entrada.interface';

@Injectable({
  providedIn: 'root'
})
export class MlApiService {
  private baseUrl = 'http://localhost:8000'; // Asegúrate que coincida con tu FastAPI

  constructor(private http: HttpClient) { }

  // 1. Endpoint: APRENDIZAJE SUPERVISADO (Predicción)
  predecir(datos: DatosEntrada): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/modelo/predecir-supervisado/`, datos);
  }

  // 2. Endpoint: APRENDIZAJE POR REFUERZO (Recomendación)
  recomendarPrecio(datos: DatosEntrada): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/agente/recomendar-precio/`, datos);
  }
}
