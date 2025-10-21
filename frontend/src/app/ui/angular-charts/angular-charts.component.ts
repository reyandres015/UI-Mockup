import { Component, Input, OnInit } from '@angular/core';
import {
  ChartConfiguration,
  ChartData,
  ChartType,
  registerables,
  Chart,
} from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

Chart.register(...registerables);

@Component({
  selector: 'app-angular-charts',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="charts-grid">
      <section class="card">
        <h3>Gráfico de burbujas — Precio vs Volumen (por cluster)</h3>
        <canvas
          baseChart
          [data]="bubbleChartData"
          [options]="bubbleChartOptions"
          [type]="bubbleChartType"
        ></canvas>
      </section>

      <section class="card">
        <h3>Gráfico de barras — Ventas por categoría</h3>
        <canvas
          baseChart
          [data]="barChartData"
          [options]="barChartOptions"
          [type]="barChartType"
        ></canvas>
      </section>

      <section class="card full-width">
        <h3>Gráfico de línea — Evolución de ventas</h3>
        <canvas
          baseChart
          [data]="lineChartData"
          [options]="lineChartOptions"
          [type]="lineChartType"
        ></canvas>
      </section>
      <section class="card alertas-section">
          <div>
            <h3>Alertas automáticas</h3>
            <ul>
              <li *ngFor="let alerta of alertas">{{ alerta }}</li>
            </ul>
          </div>
        </section>
    </div>
  `,
  styles: [
    `
      .charts-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        align-items: center;
        justify-items: center;
      }
      .card {
        background: #fff;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
      }
      h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
      }
      canvas {
        width: 100% !important;
        height: 320px !important;
      }

      .alertas-section {
        width: 100%;
        grid-column: span 2;
      }

      .full-width{
        grid-column: span 2;
      }

      li{
        list-style: none;
        padding-left: 0;
        margin-bottom: 4px;
      }
    `,
  ],
})
export class AngularChartsComponent implements OnInit {
  @Input() productos: any[] = [];
  alertas: string[] = [];

  // Colores por cluster
  private clusterColors = [
    'rgba(54,162,235,0.7)', // cluster 0
    'rgba(255,99,132,0.7)', // cluster 1
    'rgba(255,205,86,0.7)', // cluster 2
  ];

  ngOnInit() {
    this.generarGraficos();
    this.generarAlertas();
  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.generarGraficos();
    this.generarAlertas();
  }

  // ------------------ BUBBLE CHART ------------------
  public bubbleChartType: ChartType = 'bubble';
  public bubbleChartData: ChartData<'bubble'> = { datasets: [] };
  public bubbleChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const d = context.raw as any;
            return `Precio: ${d.x}, Volumen: ${d.y}`;
          },
        },
      },
    },
    scales: {
      x: { title: { display: true, text: 'Precio' } },
      y: { title: { display: true, text: 'Volumen' } },
    },
  };

  // ------------------ BAR CHART ------------------
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' },
    },
    scales: {
      x: { title: { display: true, text: 'Categoría' } },
      y: { title: { display: true, text: 'Ventas' }, beginAtZero: true },
    },
  };

  // ------------------ LINE CHART ------------------
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'nearest' },
    },
    scales: {
      x: { title: { display: true, text: 'Fecha' } },
      y: { title: { display: true, text: 'Ventas' }, beginAtZero: true },
    },
  };

  // ------------------ GENERADORES ------------------
  private generarGraficos() {
    this.prepareBubbleData();
    this.prepareBarData();
    this.prepareLineData();
  }

  private generarAlertas() {
    const clusters = new Set(this.productos.map((p) => p.cluster));
    this.alertas = [];

    clusters.forEach((c) => {
      if (c === 0)
        this.alertas.push('Cluster 0: Stock muy alto — Reducir inventario');
      if (c === 1)
        this.alertas.push('Cluster 1: Balanceado — Mantener estrategia');
      if (c === 2)
        this.alertas.push('Cluster 2: Margen bajo — Revisar precios');
    });
  }

  private prepareBubbleData() {
    const groups = new Map<number, Array<{ x: number; y: number; r: number }>>();
    console.log(this.productos);

    for (const p of this.productos) {
      const point = {
        x: p.precio,
        y: p.volumen,
        r: Math.max(4, Math.sqrt(p.volumen) / 4),
      };
      if (!groups.has(p.cluster)) groups.set(p.cluster, []);
      groups.get(p.cluster)!.push(point);
    }

    const datasets: any[] = [];
    let idx = 0;
    for (const [clusterId, points] of groups.entries()) {
      datasets.push({
        label: `Cluster ${clusterId}`,
        data: points,
        backgroundColor: this.clusterColors[idx % this.clusterColors.length],
        borderColor: this.clusterColors[idx % this.clusterColors.length],
      });
      idx++;
    }

    this.bubbleChartData = { datasets };
  }

  private prepareBarData() {
    // Agrupar por categoría sumando todas las ventas (promedio de volumen * 6 meses)
    const ventasPorCategoria: Record<string, number> = {};

    for (const p of this.productos) {
      const totalVentas = p.ventas.reduce(
        (acc: number, v: any) => acc + v.valor,
        0
      );
      ventasPorCategoria[p.categoria] =
        (ventasPorCategoria[p.categoria] || 0) + totalVentas;
    }

    const labels = Object.keys(ventasPorCategoria);
    const values = Object.values(ventasPorCategoria);

    this.barChartData = {
      labels,
      datasets: [
        {
          label: 'Ventas totales',
          data: values,
        },
      ],
    };
  }

  private prepareLineData() {
    // Combinar ventas mensuales de todos los productos
    const ventasPorMes: Record<string, number> = {};

    for (const p of this.productos) {
      for (const v of p.ventas) {
        ventasPorMes[v.fecha] = (ventasPorMes[v.fecha] || 0) + v.valor;
      }
    }

    const sortedFechas = Object.keys(ventasPorMes).sort();
    const valores = sortedFechas.map((f) => ventasPorMes[f]);

    this.lineChartData = {
      labels: sortedFechas,
      datasets: [
        {
          label: 'Ventas totales por mes',
          data: valores,
          fill: false,
          tension: 0.25,
        },
      ],
    };
  }
}
