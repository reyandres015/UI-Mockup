// src/app/simulador/simulador.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MlApiService } from '../../../domain/infrastructure/requests/ml-api.service';
import { DatosEntrada } from '../../../domain/models/datos-entrada.interface';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-simulador',
  templateUrl: './simulador.component.html',
  styleUrls: ['./simulador.component.scss']
})
export class SimuladorComponent {
  simuladorForm: FormGroup;
  resultados: any = {};
  cargando: boolean = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private mlService: MlApiService) {
    // Inicializa el formulario con las 12 variables (usa 0 como valor inicial)
    this.simuladorForm = this.fb.group({
      price: [50.0, Validators.required],
      freight_value: [10.0, Validators.required],
      product_name_lenght: [40, Validators.required],
      product_description_lenght: [500, Validators.required],
      product_photos_qty: [3, Validators.required],
      product_weight_g: [1000, Validators.required],
      product_length_cm: [20, Validators.required],
      product_height_cm: [5, Validators.required],
      product_width_cm: [15, Validators.required],
      payment_sequential: [1, Validators.required],
      payment_installments: [1, Validators.required],
      payment_value: [60.0, Validators.required]
    });
  }

  simular(): void {
    if (this.simuladorForm.invalid) {
      this.error = "Por favor, completa todos los campos del formulario.";
      return;
    }

    this.cargando = true;
    this.error = null;
    const datos: DatosEntrada = this.simuladorForm.value;

    // Ejecuta las dos llamadas a la API
    this.ejecutarAnalisisIntegral(datos);
  }

  ejecutarAnalisisIntegral(datos: DatosEntrada): void {
    // 1. Llamada para la Predicción Supervisada
    this.mlService.predecir(datos).subscribe({
      next: (resSupervisado) => {
        this.resultados.supervisado = resSupervisado;

        // 2. Llamada para la Recomendación RL/No Supervisada (se hace después de la primera)
        this.mlService.recomendarPrecio(datos).subscribe({
          next: (resRl) => {
            this.resultados.refuerzo = resRl;
            // K-Means (No Supervisado) está incluido en 'resRl' como 'estado_cliente_id'
            this.cargando = false;
          },
          error: (errRl) => {
            this.cargando = false;
            this.error = `Error Agente RL: ${errRl.message || 'Fallo de conexión.'}`;
          }
        });
      },
      error: (errSupervisado) => {
        this.cargando = false;
        this.error = `Error Supervisado: ${errSupervisado.message || 'Fallo de conexión.'}`;
      }
    });
  }
}
