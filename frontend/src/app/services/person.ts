import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/persons/';

  // Obtener la lista (con paginación)
  getPersons(url: string = this.baseUrl) {
    return lastValueFrom(this.http.get(url));
  }

  // Crear nueva persona
  createPerson(personData: any) {
    return lastValueFrom(this.http.post(this.baseUrl, personData));
  }

  // Editar persona existente
  updatePerson(id: number, personData: any) {
    return lastValueFrom(this.http.put(`${this.baseUrl}${id}/`, personData));
  }

  // Desactivar (Borrado lógico)
  deletePerson(id: number) {
    return lastValueFrom(this.http.delete(`${this.baseUrl}${id}/`));
  }
}