import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Importante para usar ngModel y routerLink
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent {
  email: string = '';
  mensajeExito: string = '';
  mensajeError: string = '';

  enviarEnlace() {
    // Validar que el campo no esté vacío
    if (!this.email) {
      this.mensajeError = 'Por favor, ingresa tu correo electrónico institucional.';
      this.mensajeExito = '';
      return;
    }

    // Aquí en el futuro conectarás con tu API de Django.
    // Por ahora, simulamos el comportamiento correcto:
    this.mensajeError = '';
    this.mensajeExito = `Si el correo ${this.email} está registrado en el sistema, recibirás las instrucciones en breve.`;
    
    // Limpiamos el campo después de "enviar"
    this.email = ''; 
  }
}