import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StateUser } from '../../models/stateUser.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestsService {

  constructor(
    private http: HttpClient
  ) { }

  urlApi: string = 'http://localhost:8000/';

  async predictSales(data: any): Promise<any> {
    const fecha = new Date(data.fecha);
    const start = new Date(fecha.getFullYear(), 0, 0);
    const diff = fecha.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    data.fecha = Math.floor(diff / oneDay);
    const status: StateUser = {
      day_of_year: data.fecha,
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
}
