import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  
  // Variables inicializadas en 0. Angular las llenará cuando Django responda.
  estadisticas = {
    profesores: 0,
    materiasActivas: 0,
    bloquesAsistencia: 0,
    cursos: 0
  };

  graficaHorarios = {
    lun: 0, mar: 0, mie: 0, jue: 0, vie: 0
  };

  ultimasActividades: any[] = [];

  // Inyectamos HttpClient para poder pedirle datos a Django
  private http = inject(HttpClient);
  
  // Inyectamos ChangeDetectorRef para forzar la actualización de la pantalla
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarDatosReales();
  }

  cargarDatosReales(): void {
    // La URL exacta que acabamos de crear en Django
    const url = 'http://127.0.0.1:8000/api/dashboard-stats/';
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        // En nuestro dashboard_views.py pusimos los datos dentro de la llave "data"
        if (response && response.data) {
          this.estadisticas = response.data.estadisticas;
          this.graficaHorarios = response.data.grafica;
          this.ultimasActividades = response.data.actividades;
          console.log('¡Datos del Dashboard cargados exitosamente!', response.data);
          
          // MAGIA AQUÍ: Le avisamos a Angular que los datos cambiaron para que repinte la pantalla
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error conectando con Django para el Dashboard:', err);
      }
    });
  }
}