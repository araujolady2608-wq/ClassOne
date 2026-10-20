import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/person'; 

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  persons: any[] = [];
  filteredPersons: any[] = [];
  
  nextUrl: string | null = null;
  previousUrl: string | null = null;
  searchTerm: string = '';

  // Variables de paginación
  totalCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  visiblePages: (number | string)[] = [1];
  jumpPageInput: number = 1;
  pageSize: number = 10;

  // Variables para Modales (CORREGIDO: 'true' en minúscula)
  mostrarModalCrear: boolean = false;
  nuevaPersona: any = { 
    dni: '', name1: '', name2: '', last_name1: '', last_name2: '', email: '', city: null, is_active: true 
  };

  mostrarModalEditar: boolean = false;
  personaAEditar: any = { 
    id: null, dni: '', name1: '', name2: '', last_name1: '', last_name2: '', email: '', city: null, is_active: true 
  };

  constructor(
    private personService: PersonService, // <-- Servicio inyectado
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadPersons();
  }

  async loadPersons(url: string = 'http://127.0.0.1:8000/api/persons/'): Promise<void> {
    try {
      const data: any = await this.personService.getPersons(url);
      
      if (data && data.results && Array.isArray(data.results)) {
        this.persons = data.results;
        this.nextUrl = data.next;
        this.previousUrl = data.previous;
        
        this.totalCount = data.count || this.persons.length;
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
        this.persons = data;
        this.nextUrl = null;
        this.previousUrl = null;
        this.totalCount = data.length;
        this.totalPages = 1;
        this.currentPage = 1;
        this.updateVisiblePages();
      } else {
        this.persons = [];
      }
      
      this.onSearch();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al cargar personas', error);
    }
  }

  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredPersons = this.persons;
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredPersons = this.persons.filter(item => 
        (item.dni && item.dni.toLowerCase().includes(term)) ||
        (item.name1 && item.name1.toLowerCase().includes(term)) ||
        (item.last_name1 && item.last_name1.toLowerCase().includes(term))
      );
    }
  }

  async goToPage(page: number): Promise<void> {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      const baseUrl = 'http://127.0.0.1:8000/api/persons/';
      const url = `${baseUrl}?page=${page}`;
      await this.loadPersons(url);
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
    this.nuevaPersona = { dni: '', name1: '', name2: '', last_name1: '', last_name2: '', email: '', city: null, is_active: true }; 
    this.mostrarModalCrear = true;
    this.cdr.detectChanges();
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.cdr.detectChanges();
  }

  async guardarNuevaPersona(): Promise<void> {
    try {
      await this.personService.createPerson(this.nuevaPersona);
      alert('¡Persona registrada exitosamente!');
      this.cerrarModalCrear();
      await this.loadPersons(); // Recargar la tabla
    } catch (error) {
      console.error('Error al guardar la persona:', error);
      alert('Ocurrió un error al guardar. Revisa la consola.');
    }
  }

  abrirModalEditar(item: any): void {
    this.personaAEditar = { ...item };
    this.mostrarModalEditar = true;
    this.cdr.detectChanges();
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.cdr.detectChanges();
  }

  async guardarEdicionPersona(): Promise<void> {
    try {
      await this.personService.updatePerson(this.personaAEditar.id, this.personaAEditar);
      alert('¡Datos de la persona actualizados!');
      this.cerrarModalEditar();
      await this.loadPersons(); // Recargar la tabla
    } catch (error) {
      console.error('Error al actualizar la persona:', error);
      alert('Ocurrió un error al actualizar. Revisa la consola.');
    }
  }

  // ==========================================
  // OTRAS ACCIONES (VER Y ELIMINAR)
  // ==========================================

  viewPerson(item: any): void {
    alert(`👁️ DETALLE DE LA PERSONA\n\nDNI: ${item.dni}\nNombres: ${item.name1} ${item.name2 || ''}\nApellidos: ${item.last_name1} ${item.last_name2 || ''}\nEmail: ${item.email || 'N/A'}`);
  }

  async deletePerson(id: number): Promise<void> {
    if (confirm('¿Estás seguro de desactivar a esta persona?')) {
      try {
        await this.personService.deletePerson(id);
        await this.loadPersons(); // Recargar la tabla tras eliminar
      } catch (error) {
        console.error('Error al eliminar persona', error);
      }
    }
  }
}