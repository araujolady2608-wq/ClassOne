import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TeacherService } from '../../services/teacher';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  teachers: any[] = [];
  filteredTeachers: any[] = [];
  // ¡AQUÍ ESTÁ LA VARIABLE QUE FALTABA!
  personasDisponibles: any[] = []; 
  
  nextUrl: string | null = null;
  previousUrl: string | null = null;
  searchTerm: string = '';

  totalCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  visiblePages: (number | string)[] = [1];
  jumpPageInput: number = 1;
  pageSize: number = 10;

  mostrarModalCrear: boolean = false;
  nuevoTeacher: any = { person: null, is_active: true };

  mostrarModalEditar: boolean = false;
  teacherAEditar: any = { id: null, person: null, is_active: true };

  private http = inject(HttpClient);

  constructor(
    private teacherService: TeacherService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarPersonas(); // Carga las personas primero
    await this.loadTeachers();
  }

  // Cargar las personas desde la API
  async cargarPersonas(): Promise<void> {
    try {
      const data: any = await lastValueFrom(this.http.get('http://127.0.0.1:8000/api/persons/?page_size=100'));
      this.personasDisponibles = data.results ? data.results : data;
    } catch (error) {
      console.error('Error al cargar la lista de personas', error);
    }
  }

  async loadTeachers(url: string = 'http://127.0.0.1:8000/api/teachers/'): Promise<void> {
    try {
      const data: any = await this.teacherService.getTeachers(url);
      if (data && data.results && Array.isArray(data.results)) {
        this.teachers = data.results;
        this.nextUrl = data.next;
        this.previousUrl = data.previous;
        this.totalCount = data.count || this.teachers.length;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize) || 1;

        if (url.includes('page=')) {
          const match = url.match(/page=(\d+)/);
          if (match) this.currentPage = parseInt(match[1], 10);
        } else {
          this.currentPage = 1;
        }
        this.updateVisiblePages();
      } else if (Array.isArray(data)) {
        this.teachers = data;
        this.totalCount = data.length;
        this.totalPages = 1;
        this.currentPage = 1;
        this.updateVisiblePages();
      } else {
        this.teachers = [];
      }
      this.onSearch();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al cargar profesores', error);
    }
  }

  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredTeachers = this.teachers;
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredTeachers = this.teachers.filter(item => 
        (item.id && item.id.toString().includes(term)) ||
        (item.person && item.person.toString().includes(term))
      );
    }
  }

  async goToPage(page: number): Promise<void> {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      await this.loadTeachers(`http://127.0.0.1:8000/api/teachers/?page=${page}`);
    }
  }

  jumpToPage(): void {
    if (this.jumpPageInput >= 1 && this.jumpPageInput <= this.totalPages) this.goToPage(this.jumpPageInput);
  }

  updateVisiblePages(): void {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2; 
    const range: (number | string)[] = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) { range.push(i); }
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    if (total > 1) range.push(total);
    this.visiblePages = range;
  }

  abrirModalCrear(): void {
    this.nuevoTeacher = { person: null, is_active: true }; 
    this.mostrarModalCrear = true;
    this.cdr.detectChanges();
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.cdr.detectChanges();
  }

  async guardarNuevoTeacher(): Promise<void> {
    try {
      await this.teacherService.createTeacher(this.nuevoTeacher);
      alert('¡Profesor registrado exitosamente!');
      this.cerrarModalCrear();
      await this.loadTeachers();
    } catch (error) {
      alert('Ocurrió un error. Verifica que la persona no esté ya asignada como profesor.');
    }
  }

  abrirModalEditar(item: any): void {
    this.teacherAEditar = { ...item };
    this.mostrarModalEditar = true;
    this.cdr.detectChanges();
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.cdr.detectChanges();
  }

  async guardarEdicionTeacher(): Promise<void> {
    try {
      await this.teacherService.updateTeacher(this.teacherAEditar.id, this.teacherAEditar);
      alert('¡Profesor actualizado!');
      this.cerrarModalEditar();
      await this.loadTeachers();
    } catch (error) {
      alert('Ocurrió un error al actualizar.');
    }
  }

  viewTeacher(item: any): void {
    alert(`👁️ DETALLE DEL PROFESOR\n\nID Profesor: ${item.id}\nVinculado a Persona ID: ${item.person}\nEstado: ${item.is_active ? 'Activo' : 'Inactivo'}`);
  }

  async deleteTeacher(id: number): Promise<void> {
    if (confirm('¿Estás seguro de desactivar a este profesor?')) {
      try {
        await this.teacherService.deleteTeacher(id);
        await this.loadTeachers();
      } catch (error) {
        console.error('Error al eliminar', error);
      }
    }
  }
}