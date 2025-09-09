import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiRequestsService } from '../../../domain/infrastructure/api-requests.service';
import { PredictionUser } from '../../../domain/models/predictionUser.interface';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  form!: FormGroup;
  predictionResult!: PredictionUser

  constructor(
    private fb: FormBuilder,
    private apiService: ApiRequestsService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      sueño: [8, Validators.required],
      ejercicio: [3, Validators.required],
      presion: [120, Validators.required]
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      alert('Formulario inválido');
      return;
    }
    this.apiService.predictStressLevel(this.form.value)
      .then(response => {
        this.predictionResult = response.data as PredictionUser;
      })
      .catch(error => {
        alert('Error al realizar la predicción. Por favor, inténtelo de nuevo.');
        console.error(error);
      });
  }

  consultarEspecialista(): void {
    this.apiService.consultSpecialist()
      .then(response => {
        this.predictionResult.decision_action = response.message;
      })
      .catch(error => {
        this.predictionResult.decision_action = 'Error al consultar con el especialista. Por favor, inténtelo de nuevo.';
        console.error(error);
      });
  }
}
