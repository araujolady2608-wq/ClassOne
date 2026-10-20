import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { SchoolAdministratorService } from '../../services/school-administrator';

@Component({
  selector: 'app-school-administrator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './school-administrator.component.html',
  styleUrls: ['./school-administrator.component.css']
})
export class SchoolAdministratorComponent implements OnInit {
  administrators: any[] = [];
  filteredAdministrators: any[] = [];
  personasDisponibles: any[] = []; // <-- Variable para guardar la lista
  
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
  nuevoAdmin: any = { person: null, role: 'Coordinador', is_active: true };

  mostrarModalEditar: boolean = false;
  adminAEditar: any = { id: null, person: null, role: '', is_active: true };

  private http = inject(HttpClient); // <-- Inyección para peticiones

  constructor(
    private adminService: SchoolAdministratorService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarPersonas(); // <-- Cargar lista de personas primero
    await this.loadAdministrators();
  }

  // === Función para traer la lista de personas ===
  async cargarPersonas(): Promise<void> {
    try {
      const data: any = await lastValueFrom(this.http.get('http://127.0.0.1:8000/api/persons/?page_size=100'));
      this.personasDisponibles = data.results ? data.results : data;
    } catch (error) {
      console.error('Error al cargar la lista de personas', error);
    }
  }

  async loadAdministrators(url: string = 'http://127.0.0.1:8000/api/school-administrators/'): Promise<void> {
    try {
      const data: any = await this.adminService.getAdministrators(url);
      
      if (data && data.results && Array.isArray(data.results)) {
        this.administrators = data.results;
        this.nextUrl = data.next;
        this.previousUrl = data.previous;
        this.totalCount = data.count || this.administrators.length;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize) || 1;

        if (url.includes('page=')) {
          const match = url.match(/page=(\d+)/);
          if (match) this.currentPage = parseInt(match[1], 10);
        } else {
          this.currentPage = 1;
        }
        this.updateVisiblePages();
      } else if (Array.isArray(data)) {
        this.administrators = data;
        this.nextUrl = null;
        this.previousUrl = null;
        this.totalCount = data.length;
        this.totalPages = 1;
        this.currentPage = 1;
        this.updateVisiblePages();
      } else {
        this.administrators = [];
      }
      
      this.onSearch();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al cargar administradores', error);
    }
  }

  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredAdministrators = this.administrators;
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredAdministrators = this.administrators.filter(item => 
        (item.id && item.id.toString().includes(term)) ||
        (item.person && item.person.toString().includes(term)) ||
        (item.role && item.role.toLowerCase().includes(term))
      );
    }
  }

  async goToPage(page: number): Promise<void> {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      const baseUrl = 'http://127.0.0.1:8000/api/school-administrators/';
      await this.loadAdministrators(`${baseUrl}?page=${page}`);
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
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) { range.push(i); }
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    if (total > 1) range.push(total);
    this.visiblePages = range;
  }

  abrirModalCrear(): void {
    this.nuevoAdmin = { person: null, role: 'Coordinador', is_active: true }; 
    this.mostrarModalCrear = true;
    this.cdr.detectChanges();
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.cdr.detectChanges();
  }

  async guardarNuevoAdmin(): Promise<void> {
    try {
      await this.adminService.createAdministrator(this.nuevoAdmin);
      alert('¡Administrador registrado exitosamente!');
      this.cerrarModalCrear();
      await this.loadAdministrators();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al crear. Verifica que el ID de persona exista y no esté ya asignado.');
    }
  }

  abrirModalEditar(item: any): void {
    this.adminAEditar = { ...item };
    this.mostrarModalEditar = true;
    this.cdr.detectChanges();
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.cdr.detectChanges();
  }

  async guardarEdicionAdmin(): Promise<void> {
    try {
      await this.adminService.updateAdministrator(this.adminAEditar.id, this.adminAEditar);
      alert('¡Datos actualizados!');
      this.cerrarModalEditar();
      await this.loadAdministrators();
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Ocurrió un error al actualizar.');
    }
  }

  viewAdministrator(item: any): void {
    alert(`👁️ DETALLE\n\nID Admin: ${item.id}\nRol: ${item.role}\nID Persona: ${item.person}\nEstado: ${item.is_active ? 'Activo' : 'Inactivo'}`);
  }

  async deleteAdministrator(id: number): Promise<void> {
    if (confirm('¿Estás seguro de desactivar este registro?')) {
      try {
        await this.adminService.deleteAdministrator(id);
        await this.loadAdministrators();
      } catch (error) {
        console.error('Error al eliminar', error);
      }
    }
  }
}