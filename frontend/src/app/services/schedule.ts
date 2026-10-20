import { Injectable } from '@angular/core';
import axios from 'axios';

// Interfaz que coincide con el modelo Schedule de Django
export interface Schedule {
  id?: number;
  is_active?: boolean;
  day_week: string;
  course: number;
  classtime: number;
  teacher: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  // Endpoint de Django 
  private apiUrl = 'http://127.0.0.1:8000/api/schedules/';

  constructor() {}

  // GET: Permite listar los horarios soportando paginación y filtro por día
  async getSchedules(url: string = this.apiUrl, dayFilter?: string): Promise<any> {
    try {
      let targetUrl = url;
      // Si se envía un día y estamos en la URL base, añadimos el parámetro de filtrado para Django
      if (dayFilter && dayFilter.trim() !== '' && url === this.apiUrl) {
        targetUrl = `${this.apiUrl}?day_week=${encodeURIComponent(dayFilter)}`;
      }
      const response = await axios.get(targetUrl);
      return response.data; 
    } catch (error) {
      console.error('Error al listar horarios:', error);
      throw error;
    }
  }

  // POST
  async createSchedule(schedule: Schedule): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl, schedule, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear horario:', error);
      throw error;
    }
  }

  // PUT
  async updateSchedule(id: number, schedule: Schedule): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}${id}/`, schedule, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar horario:', error);
      throw error;
    }
  }

  // DELETE
  async deleteSchedule(id: number): Promise<any> {
    try {
      const response = await axios.delete(`${this.apiUrl}${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      throw error;
    }
  }
}