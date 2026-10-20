import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubjectService, Subject } from '../../services/subject';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  
  nextUrl: string | null = null;
  previousUrl: string | null = null;
  searchTerm: string = '';

  // ==========================================
  // VARIABLES DE PAGINACIÓN AVANZADA
  // ==========================================
  totalCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  visiblePages: (number | string)[] = [1];
  jumpPageInput: number = 1;
  pageSize: number = 10;

  // ==========================================
  // VARIABLES PARA LOS MODALES
  // ==========================================
  mostrarModalCrear: boolean = false;
  nuevaMateria: any = { name_subject: '', is_active: true };

  mostrarModalEditar: boolean = false;
  materiaAEditar: any = { id: null, name_subject: '', is_active: true };

  constructor(
    private subjectService: SubjectService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadSubjects();
  }

  async loadSubjects(url: string = 'http://127.0.0.1:8000/api/subjects/'): Promise<void> {
    try {
      const data: any = await this.subjectService.getSubjects(url);
      
      if (data && data.results && Array.isArray(data.results)) {
        this.subjects = data.results;
        this.nextUrl = data.next;
        this.previousUrl = data.previous;
        
        this.totalCount = data.count || this.subjects.length;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize) || 1;

        if (url.includes('page=')) {
          const match = url.match(/page=(\d+)/);
          if (match) {
            this.currentPage = parseInt(match[1], 10);
          }
        } else {
          this.currentPage = 1;
        }

        this.updateVisiblePages();
      } else if (Array.isArray(data)) {
        this.subjects = data;
        this.nextUrl = null;
        this.previousUrl = null;
        this.totalCount = data.length;
        this.totalPages = 1;
        this.currentPage = 1;
        this.updateVisiblePages();
      } else {
        this.subjects = [];
      }
      
      this.onSearch();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al cargar materias', error);
    }
  }

  // Búsqueda local por nombre de materia
  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredSubjects = this.subjects;
    } else {
      this.filteredSubjects = this.subjects.filter(item => 
        item.name_subject && item.name_subject.toLowerCase().includes(this.searchTerm.toLowerCase().trim())
      );
    }
  }

  // ==========================================
  // LÓGICA DE NAVEGACIÓN Y PAGINACIÓN
  // ==========================================
  
  async goToPage(page: number): Promise<void> {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      const baseUrl = 'http://127.0.0.1:8000/api/subjects/';
      const url = `${baseUrl}?page=${page}`;
      await this.loadSubjects(url);
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

  // ==========================================
  // LÓGICA DE MODALES: CREAR Y EDITAR
  // ==========================================

  abrirModalCrear(): void {
    this.nuevaMateria = { name_subject: '', is_active: true }; 
    this.mostrarModalCrear = true;
    this.cdr.detectChanges();
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.cdr.detectChanges();
  }

  guardarNuevaMateria(): void {
    console.log('Materia a guardar:', this.nuevaMateria);
    alert(`¡Listo! Se guardará la materia: ${this.nuevaMateria.name_subject}`);
    this.cerrarModalCrear();
  }

  abrirModalEditar(item: any): void {
    this.materiaAEditar = { ...item };
    this.mostrarModalEditar = true;
    this.cdr.detectChanges();
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.cdr.detectChanges();
  }

  guardarEdicionMateria(): void {
    console.log('Materia a actualizar:', this.materiaAEditar);
    alert(`¡Cambios listos para enviarse a Django para la materia ID ${this.materiaAEditar.id}!`);
    this.cerrarModalEditar();
  }

  // ==========================================
  // OTRAS ACCIONES (VER Y ELIMINAR)
  // ==========================================

  viewSubject(item: any): void {
    alert(`👁️ DETALLE DE LA MATERIA\n\nID: ${item.id}\nNombre: ${item.name_subject}\nEstado: ${item.is_active ? 'Activo' : 'Inactivo'}`);
  }

  async deleteSubject(id: number): Promise<void> {
    if (confirm('¿Estás seguro de desactivar esta materia?')) {
      try {
        await this.subjectService.deleteSubject(id);
        await this.loadSubjects();
      } catch (error) {
        console.error('Error al eliminar materia', error);
      }
    }
  }
}