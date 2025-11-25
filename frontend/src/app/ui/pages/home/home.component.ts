import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularChartsComponent } from '../../angular-charts/angular-charts.component';
import { HttpClient } from '@angular/common/http';
import { SimuladorComponent } from '../../components/simulador/simulador.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AngularChartsComponent, FormsModule, SimuladorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
  ) { }

  productos: any[] = [];
  graphsData: any[] = [];

  clusterFilter: string = 'all';
  categoryFilter: string = 'all';

  categorias = [
    "Electrónica",
    "Ropa",
    "Hogar",
    "Juguetes",
    "Deportes",
    "Belleza",
    "Libros",
    "Alimentos",
    "Mascotas",
    "Automotriz"
  ];

  totalSales: number = 0;
  changePercentSales: number = 0;

  averageMargin: number = 0;
  changePercentMargin: number = 0;

  volume: number = 0;
  changePercentVolume: number = 0;

  averageTicket: number = 0;
  changePercentTicket: number = 0;

  ngOnInit(): void {
    this.http.get<any[]>('/assets/data/productos.json').subscribe((data) => {
      this.productos = data;
      this.graphsData = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.graphsData = this.productos.filter(producto => {
      const clusterMatch = this.clusterFilter === 'all' || producto.cluster.toString() === this.clusterFilter;
      const categoryMatch = this.categoryFilter === 'all' || producto.categoria === this.categoryFilter;
      return clusterMatch && categoryMatch;
    });
    this.calcularEstadisticas();
  }

  calcularEstadisticas() {
    const productos = this.graphsData;

    // Total ventas
    this.totalSales = productos.reduce((sum, p) => sum + (p.precio * p.volumen || 0), 0);

    // Margen promedio
    const totalMargen = productos.reduce((sum, p) => sum + (p.margen || 0), 0);
    this.averageMargin = productos.length ? (totalMargen / productos.length) * 100 : 0;

    // Volumen
    this.volume = productos.reduce((sum, p) => sum + (p.volumen || 0), 0);

    // Ticket promedio
    this.averageTicket = productos.length ? this.totalSales / productos.length : 0;
  }
}
