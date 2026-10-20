import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService, Schedule } from '../../services/schedule';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  schedules: Schedule[] = [];
  filteredSchedules: Schedule[] = []; // Arreglo para la vista filtrada localmente
  
  nextUrl: string | null = null;
  previousUrl: string | null = null;

  // Filtros combinados
  selectedDayFilter: string = '';
  selectedTeacherFilter: string = ''; // Nueva variable para buscar por profesor

  // ==========================================
  // VARIABLES DE PAGINACIÓN AVANZADA
  // ==========================================
  totalCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  visiblePages: (number | string)[] = [1];
  jumpPageInput: number = 1;
  pageSize: number = 10; // Cantidad de registros por página

  // ==========================================
  // VARIABLES PARA LOS MODALES
  // ==========================================
  
  // Modal de Crear
  mostrarModalCrear: boolean = false;
  nuevoHorario: any = { day_week: '', classtime: '', teacher: '', course: '' };

  // Modal de Editar
  mostrarModalEditar: boolean = false;
  horarioAEditar: any = { id: null, day_week: '', classtime: '', teacher: '', course: '' };


  constructor(
    private scheduleService: ScheduleService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadSchedules();
  }

  async loadSchedules(url: string = 'http://127.0.0.1:8000/api/schedules/'): Promise<void> {
    try {
      const data: any = await this.scheduleService.getSchedules(url);
      
      if (data && data.results && Array.isArray(data.results)) {
        this.schedules = data.results;
        this.nextUrl = data.next;
        this.previousUrl = data.previous;
        
        // Extraer datos de la paginación del Backend (Django)
        this.totalCount = data.count || this.schedules.length;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize) || 1;

        // Detectar en qué página estamos según la URL
        if (url.includes('page=')) {
          const match = url.match(/page=(\d+)/);
          if (match) {
            this.currentPage = parseInt(match[1], 10);
          }
        } else {
          this.currentPage = 1;
        }

        // Actualizar los números de los botones de abajo [1] [2] [3]
        this.updateVisiblePages();

      } else if (Array.isArray(data)) {
        this.schedules = data;
        this.nextUrl = null;
        this.previousUrl = null;
        this.totalCount = data.length;
        this.totalPages = 1;
        this.currentPage = 1;
        this.updateVisiblePages();
      } else {
        this.schedules = [];
        this.nextUrl = null;
        this.previousUrl = null;
      }
      
      // Aplicamos el filtro local al cargar los datos
      this.applyFilter();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al cargar horarios', error);
    }
  }

  // Filtrado local instantáneo combinado (Día y Profesor)
  applyFilter(): void {
    this.filteredSchedules = this.schedules.filter(item => {
      
      // 1. Verificamos si cumple el filtro del día
      const coincideDia = !this.selectedDayFilter || this.selectedDayFilter === '' || 
                          (item.day_week && item.day_week.toLowerCase().trim() === this.selectedDayFilter.toLowerCase().trim());
      
      // 2. Verificamos si cumple el filtro del profesor
      const coincideProfesor = !this.selectedTeacherFilter || this.selectedTeacherFilter.trim() === '' || 
                               (item.teacher && item.teacher.toString().toLowerCase().includes(this.selectedTeacherFilter.toLowerCase().trim()));

      // 3. El registro se muestra solo si cumple AMBAS condiciones
      return coincideDia && coincideProfesor;
    });
  }

  // ==========================================
  // LÓGICA DE NAVEGACIÓN Y PAGINACIÓN
  // ==========================================
  
  async goToPage(page: number): Promise<void> {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      const baseUrl = 'http://127.0.0.1:8000/api/schedules/';
      const url = `${baseUrl}?page=${page}`;
      await this.loadSchedules(url);
    }
  }

  jumpToPage(): void {
    if (this.jumpPageInput >= 1 && this.jumpPageInput <= this.totalPages) {
      this.goToPage(this.jumpPageInput);
    }
  }

  updateVisiblePages(): void {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2; 
    const range: (number | string)[] = [];
    
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    
    range.unshift(1);
    if (total > 1) range.push(total);
    
    this.visiblePages = range;
  }

  async nextPage(): Promise<void> {
    if (this.nextUrl) {
      await this.loadSchedules(this.nextUrl);
    }
  }

  async prevPage(): Promise<void> {
    if (this.previousUrl) {
      await this.loadSchedules(this.previousUrl);
    }
  }

  // ==========================================
  // LÓGICA DE MODALES: CREAR Y EDITAR
  // ==========================================

  abrirModalCrear(): void {
    // Limpiamos los campos antes de abrir
    this.nuevoHorario = { day_week: '', classtime: '', teacher: '', course: '' }; 
    this.mostrarModalCrear = true;
    this.cdr.detectChanges(); 
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.cdr.detectChanges();
  }

  guardarNuevoHorario(): void {
    console.log('Se guardará el nuevo horario:', this.nuevoHorario);
    alert(`¡Formulario listo! Se enviarán los datos a la base de datos.`);
    this.cerrarModalCrear();
  }

  openEditModal(schedule: Schedule): void {
    // Clonamos los datos para llenar las casillas y no modificar la tabla accidentalmente
    this.horarioAEditar = { ...schedule };
    this.mostrarModalEditar = true;
    this.cdr.detectChanges();
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.cdr.detectChanges();
  }

  guardarEdicionHorario(): void {
    console.log('Guardando cambios del horario:', this.horarioAEditar);
    alert(`¡Los cambios para el horario ID ${this.horarioAEditar.id} están listos para enviarse a Django!`);
    this.cerrarModalEditar();
  }

  // ==========================================
  // OTRAS ACCIONES (VER Y ELIMINAR)
  // ==========================================

  viewDetail(schedule: Schedule): void {
    alert(`👁️ DETALLE DEL HORARIO\n\nID: ${schedule.id}\nDía: ${schedule.day_week}\nCurso: #${schedule.course}\nProfesor: #${schedule.teacher}\nBloque Horario: #${schedule.classtime}`);
  }

  async deleteSchedule(id: number): Promise<void> {
    if (confirm('¿Estás seguro de desactivar este horario?')) {
      try {
        await this.scheduleService.deleteSchedule(id);
        await this.loadSchedules(); // Recargar la tabla
      } catch (error) {
        console.error('Error al eliminar horario', error);
      }
    }
  }
}