import axios from 'axios';

// Credenciales
export interface LoginCredentials {
  username: string;
  password: string;
}

// URL del endpoint de login
const API_URL = 'http://127.0.0.1:8000/api/token/'; 

export class AuthService {
  
  // POST - Inicio de Sesión
  async login(credentials: LoginCredentials) {
    try {
      const response = await axios.post(API_URL, credentials);
      
      // Almacentamiento local 
      if (response.data && response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error;
    }
  }

  // Cerrar sesión - Borrado de Credenciales
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}