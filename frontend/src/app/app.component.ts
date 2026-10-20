import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IEMEP Admin';

  // Inyectamos el Router para poder leer en qué página estamos
  constructor(private router: Router) {}

  // Esta función decide si ocultar o mostrar el menú lateral
  isPublicRoute(): boolean {
    const url = this.router.url;
    // Oculta el menú si estamos en el inicio, en el login, o recuperando contraseña
    return url === '/' || url === '/login' || url === '/recuperar-password';
  }
}