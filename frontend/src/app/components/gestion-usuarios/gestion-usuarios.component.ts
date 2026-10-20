import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {
  
  // === VARIABLES DE LA TABLA Y PAGINACIÓN ===
  usuariosTotales: any[] = [];
  usuariosPaginados: any[] = [];
  
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalResultados: number = 0;
  totalPaginas: number = 0;

  // === VARIABLES DEL MODAL GENERAR ACCESO ===
  mostrarModalCrear: boolean = false;
  personaSeleccionadaId: string = ''; 
  nuevoUsuario = {
    dni: '',
    name1: '',
    last_name1: '',
    email: '',
    rol: '' 
  };

  // === VARIABLES DEL MODAL EDITAR ===
  mostrarModalEditar: boolean = false;
  usuarioAEditar = {
    id: null as number | null,
    dni: '',
    name1: '',
    last_name1: '',
    email: '',
    rol: ''
  };

  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef); 

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.obtenerDatosCompletos().subscribe({
      next: (data) => {
        const listaPersonas = data.personas.results || data.personas;
        const listaProfesores = data.profesores.results || data.profesores;
        const listaAdmins = data.administradores.results || data.administradores;

        this.usuariosTotales = listaPersonas.map((persona: any) => {
          const esProfesor = listaProfesores.find((prof: any) => prof.person === persona.id);
          const esAdmin = listaAdmins.find((adm: any) => adm.person === persona.id);

          let rolAsignado = 'Sin Rol';
          if (esProfesor) rolAsignado = 'Docente';
          else if (esAdmin) rolAsignado = esAdmin.role;

          return {
            id: persona.id,
            dni: persona.dni,
            name1: persona.name1,
            last_name1: persona.last_name1,
            nombre: `${persona.name1} ${persona.last_name1}`,
            correo: persona.email || '',
            rol: rolAsignado,
            estado: persona.is_active ? 'Activo' : 'Inactivo'
          };
        });

        this.totalResultados = this.usuariosTotales.length;
        this.totalPaginas = Math.ceil(this.totalResultados / this.itemsPorPagina);
        this.actualizarTabla();
      },
      error: (err) => console.error('ERROR conectando con Django:', err)
    });
  }

  actualizarTabla() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.usuariosPaginados = this.usuariosTotales.slice(inicio, fin);
    this.cdr.detectChanges(); 
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarTabla();
    }
  }

  obtenerArregloPaginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irAPagina(event: any) {
    const valor = parseInt(event.target.value, 10);
    if (!isNaN(valor)) this.cambiarPagina(valor);
  }

  // ============================================
  // === LÓGICA DEL MODAL: GENERAR ACCESOS ===
  // ============================================
  abrirModalCrear() {
    this.mostrarModalCrear = true;
    this.personaSeleccionadaId = ''; 
    this.nuevoUsuario = { dni: '', name1: '', last_name1: '', email: '', rol: '' };
    this.cdr.detectChanges(); 
  }

  cerrarModalCrear() {
    this.mostrarModalCrear = false;
    this.cdr.detectChanges();
  }

  onSeleccionarPersona() {
    const persona = this.usuariosTotales.find(p => p.id == this.personaSeleccionadaId);
    if (persona) {
      this.nuevoUsuario = {
        dni: persona.dni,
        name1: persona.name1,
        last_name1: persona.last_name1,
        email: persona.correo,
        rol: persona.rol
      };
    }
  }

  guardarUsuario() {
    alert(`Se generarán credenciales de acceso para: ${this.nuevoUsuario.name1}.\nUsuario: ${this.nuevoUsuario.email}\nContraseña: ${this.nuevoUsuario.dni}`);
    this.cerrarModalCrear();
  }

  // ============================================
  // === LÓGICA DEL MODAL: EDITAR USUARIO ===
  // ============================================
  editarUsuario(id: number) {
    const usuario = this.usuariosTotales.find(u => u.id === id);
    if (usuario) {
      this.usuarioAEditar = {
        id: usuario.id,
        dni: usuario.dni,
        name1: usuario.name1,
        last_name1: usuario.last_name1,
        email: usuario.correo, 
        rol: usuario.rol
      };
      this.mostrarModalEditar = true;
      this.cdr.detectChanges(); 
    }
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.cdr.detectChanges();
  }

  guardarEdicion() {
    alert(`¡Los cambios de ${this.usuarioAEditar.name1} están listos para ser enviados a la base de datos!`);
    this.cerrarModalEditar();
  }

  // ============================================
  // === ACCIONES: VER Y ELIMINAR ===
  // ============================================
  verUsuario(id: number) {
    const usuario = this.usuariosTotales.find(u => u.id === id);
    if (usuario) {
      alert(`👁️ VISUALIZANDO PERFIL\n\nNombre: ${usuario.nombre}\nDNI: ${usuario.dni}\nCorreo: ${usuario.correo}\nRol: ${usuario.rol}\nEstado: ${usuario.estado}`);
    }
  }

  eliminarUsuario(id: number) {
    const usuario = this.usuariosTotales.find(u => u.id === id);
    if (usuario) {
      const confirmacion = confirm(`⚠️ ADVERTENCIA\n\n¿Estás completamente seguro de que deseas desactivar a ${usuario.nombre}? Perderá el acceso al sistema.`);
      if (confirmacion) {
        alert(`✅ El usuario ${usuario.nombre} ha sido marcado para desactivación.`);
      }
    }
  }

}