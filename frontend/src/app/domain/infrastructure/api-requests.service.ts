import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StateUser } from '../models/stateUser.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestsService {

  constructor(
    private http: HttpClient
  ) { }

  urlApi: string = 'http://localhost:8000/';

  async predictStressLevel(data: any): Promise<any> {
    const status: StateUser = {
      sleep_duration: data.sueño,
      exercise_level: data.ejercicio,
      blood_pressure: data.presion
    };

    return this.http.post(this.urlApi + 'predict', status)
      .toPromise()
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        console.error('Error al realizar la solicitud:', error);
        throw error;
      });
  }

  async consultSpecialist(): Promise<any> {
    return this.http.get(this.urlApi + 'consult_specialist')
      .toPromise()
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        console.error('Error al realizar la solicitud:', error);
        throw error;
      });
  }
}
