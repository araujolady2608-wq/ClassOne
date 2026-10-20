import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  vistaActual: string = 'inicio';
  
  // Variables del Calendario (Inicia en Octubre de 2026 por el mes actual)
  fechaActual: Date = new Date(); 
  mesMostrado: Date = new Date(2026, 9, 1); // Mes 9 es Octubre en JavaScript (0-index)
  diasCalendario: any[] = [];
  eventosMes: any[] = [];
  nombreMeses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

  // ==========================================
  // BASE DE DATOS DE FECHAS OFICIALES (Integrada)
  // ==========================================
  todosLosEventos = [
    // ENERO
    { fecha: '2026-01-01', titulo: 'Vacaciones / Receso', desc: '1 al 4 de enero (Docentes desde 29 Dic)', color: 'warning' },
    { fecha: '2026-01-05', titulo: 'Vacaciones Docentes / Receso', desc: '5 al 11 de enero', color: 'warning' },
    { fecha: '2026-01-12', titulo: 'Desarrollo Institucional (Sem. 1)', desc: '12 al 18 de enero (Receso Estudiantil)', color: 'primary' },
    { fecha: '2026-01-19', titulo: 'Desarrollo Institucional (Sem. 2)', desc: '19 al 25 de enero (Receso Estudiantil)', color: 'primary' },
    { fecha: '2026-01-26', titulo: 'Inicio Primer Periodo', desc: '10 semanas lectivas', color: 'success' },

    // MARZO / ABRIL
    { fecha: '2026-03-30', titulo: 'Desarrollo Institucional (Sem. 3)', desc: '30 de marzo al 5 de abril (Receso Estudiantil)', color: 'primary' },
    { fecha: '2026-04-13', titulo: 'Inicio Segundo Periodo', desc: '10 semanas lectivas', color: 'success' },

    // JUNIO / JULIO
    { fecha: '2026-06-22', titulo: 'Vacaciones Docentes / Receso', desc: '22 al 28 de junio', color: 'warning' },
    { fecha: '2026-06-29', titulo: 'Vacaciones Docentes / Receso', desc: '29 de junio al 5 de julio', color: 'warning' },
    { fecha: '2026-07-06', titulo: 'Inicio Tercer Periodo', desc: '10 semanas lectivas', color: 'success' },

    // SEPTIEMBRE / OCTUBRE
    { fecha: '2026-09-14', titulo: 'Inicio Cuarto Periodo', desc: '10 semanas lectivas', color: 'success' },
    { fecha: '2026-10-05', titulo: 'Desarrollo Institucional (Sem. 4)', desc: '5 al 11 de octubre (Receso Estudiantil)', color: 'primary' },
    { fecha: '2026-10-12', titulo: 'Día de la Raza (Festivo)', desc: 'No hay actividad académica', color: 'danger' },

    // NOVIEMBRE / DICIEMBRE
    { fecha: '2026-11-29', titulo: 'Fin Cuarto Periodo', desc: 'Cierre periodo académico', color: 'danger' },
    { fecha: '2026-11-30', titulo: 'Desarrollo Institucional (Sem. 5)', desc: '30 nov al 6 de dic (Receso Estudiantil)', color: 'primary' },
    { fecha: '2026-12-07', titulo: 'Vacaciones Docentes / Receso', desc: '7 al 13 de diciembre', color: 'warning' },
    { fecha: '2026-12-14', titulo: 'Vacaciones Docentes / Receso', desc: '14 al 20 de diciembre', color: 'warning' },
    { fecha: '2026-12-21', titulo: 'Vacaciones Docentes / Receso', desc: '21 al 27 de diciembre', color: 'warning' }
  ];

  ngOnInit() {
    this.generarCalendario();
  }

  cambiarVista(nuevaVista: string) {
    this.vistaActual = nuevaVista;
    if(nuevaVista === 'calendario') this.generarCalendario();
  }

  // --- LÓGICA DE NAVEGACIÓN DEL CALENDARIO ---
  mesAnterior() {
    this.mesMostrado = new Date(this.mesMostrado.getFullYear(), this.mesMostrado.getMonth() - 1, 1);
    this.generarCalendario();
  }

  mesSiguiente() {
    this.mesMostrado = new Date(this.mesMostrado.getFullYear(), this.mesMostrado.getMonth() + 1, 1);
    this.generarCalendario();
  }

  // --- CONSTRUCCIÓN DE LA CUADRÍCULA ---
  generarCalendario() {
    const año = this.mesMostrado.getFullYear();
    const mes = this.mesMostrado.getMonth();
    
    // Filtra los eventos que pertenecen exactamente al mes que estamos viendo
    this.eventosMes = this.todosLosEventos.filter(evento => {
      const fechaEv = new Date(evento.fecha + 'T00:00:00');
      return fechaEv.getMonth() === mes && fechaEv.getFullYear() === año;
    });

    const primerDia = new Date(año, mes, 1).getDay();
    const diasEnMes = new Date(año, mes + 1, 0).getDate();
    const ajusteInicio = primerDia === 0 ? 6 : primerDia - 1; // Lunes como primer día de la semana
    
    this.diasCalendario = [];
    
    // Rellena los espacios vacíos antes del día 1
    for (let i = 0; i < ajusteInicio; i++) {
      this.diasCalendario.push({ numero: null, tieneEvento: false });
    }
    
    // Rellena los días reales del mes y busca si tienen un evento asignado
    for (let i = 1; i <= diasEnMes; i++) {
      const fechaFormateada = `${año}-${(mes+1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const evento = this.todosLosEventos.find(e => e.fecha === fechaFormateada);
      this.diasCalendario.push({ 
        numero: i, 
        tieneEvento: !!evento,
        esHoy: i === this.fechaActual.getDate() && mes === this.fechaActual.getMonth() && año === this.fechaActual.getFullYear()
      });
    }
  }
}