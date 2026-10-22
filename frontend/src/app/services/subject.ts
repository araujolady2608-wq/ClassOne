import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface Subject {
  id?: number;
  name_subject: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  // URL actualizada usando el entorno
  private apiUrl = environment.apiUrl + 'subjects/';

  constructor() {}

  // GET
  async getSubjects(url: string = this.apiUrl): Promise<any> {
    try {
      const response = await axios.get(url);
      return response.data; 
    } catch (error) {
      console.error('Error al listar materias:', error);
      throw error;
    }
  }

  // POST
  async createSubject(subject: Subject): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl, subject, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear materia:', error);
      throw error;
    }
  }

  // PUT
  async updateSubject(id: number, subject: Subject): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}${id}/`, subject, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar materia:', error);
      throw error;
    }
  }

  // DELETE
  async deleteSubject(id: number): Promise<any> {
    try {
      const response = await axios.delete(`${this.apiUrl}${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar materia:', error);
      throw error;
    }
  }
}