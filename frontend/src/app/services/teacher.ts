import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/teachers/';

  getTeachers(url: string = this.baseUrl) {
    return lastValueFrom(this.http.get(url));
  }

  createTeacher(data: any) {
    return lastValueFrom(this.http.post(this.baseUrl, data));
  }

  updateTeacher(id: number, data: any) {
    return lastValueFrom(this.http.put(`${this.baseUrl}${id}/`, data));
  }

  deleteTeacher(id: number) {
    return lastValueFrom(this.http.delete(`${this.baseUrl}${id}/`));
  }
}