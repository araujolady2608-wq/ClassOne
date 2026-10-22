import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  obtenerDatosCompletos(): Observable<any> {
    // Le pedimos a Django que nos mande el bloque completo para cruzarlo sin desfases
    return forkJoin({
      personas: this.http.get<any>(`${this.apiUrl}persons/?page_size=100`),
      profesores: this.http.get<any>(`${this.apiUrl}teachers/?page_size=100`),
      administradores: this.http.get<any>(`${this.apiUrl}school-administrators/?page_size=100`)
    });
  }
}