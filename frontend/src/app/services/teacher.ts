import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'teachers/';

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