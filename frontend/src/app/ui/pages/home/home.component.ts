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
      fecha: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      alert('Formulario inválido');
      return;
    }
    this.apiService.predictSales(this.form.value)
      .then(response => {
        this.predictionResult = response.data as PredictionUser;
      })
      .catch(error => {
        alert('Error al realizar la predicción. Por favor, inténtelo de nuevo.');
        console.error(error);
      });
  }
}
