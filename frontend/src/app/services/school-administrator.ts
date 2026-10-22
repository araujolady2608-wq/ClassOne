import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolAdministratorService {
  private http = inject(HttpClient);
  
  // URL corregida y enlazada al entorno
  private baseUrl = environment.apiUrl + 'school-administrators/';

  // Obtener la lista (con paginación)
  getAdministrators(url: string = this.baseUrl) {
    return lastValueFrom(this.http.get(url));
  }

  createAdministrator(data: any) {
    return lastValueFrom(this.http.post(this.baseUrl, data));
  }

  updateAdministrator(id: number, data: any) {
    return lastValueFrom(this.http.put(`${this.baseUrl}${id}/`, data));
  }

  deleteAdministrator(id: number) {
    return lastValueFrom(this.http.delete(`${this.baseUrl}${id}/`));
  }
}