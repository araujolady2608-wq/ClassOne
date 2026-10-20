import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // <-- ¡Agregamos RouterModule!
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // <-- Lo declaramos aquí también
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  // ==========================================
  // NUEVAS VARIABLES PARA LA INTERFAZ
  // ==========================================
  showPassword: boolean = false;
  rememberMe: boolean = false;

  private authService = new AuthService();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Al entrar al login, borramos cualquier token viejo
    this.authService.logout();
  }

  // Función para alternar entre ver/ocultar contraseña
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onLogin(): Promise<void> {
    try {
      this.errorMessage = '';

      // Si "Recuérdame" está marcado, aquí podrías guardar el usuario en el navegador
      if (this.rememberMe) {
        console.log('El usuario eligió guardar su sesión');
      }

      await this.authService.login({
        username: this.username,
        password: this.password
      });

      // Si es exitoso, viaja al dashboard
      this.router.navigate(['/admin-dashboard']);
    } catch (error) {
      this.errorMessage = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.';
      console.error('Error de autenticación', error);
    }
  }
}