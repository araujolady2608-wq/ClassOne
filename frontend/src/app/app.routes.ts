import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component'; 
import { SubjectComponent } from './components/subject/subject.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { LandingComponent } from './components/landing/landing.component'; 
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { PersonComponent } from './components/person/person.component';
import { SchoolAdministratorComponent } from './components/school-administrator/school-administrator.component';

export const routes: Routes = [
  // 2. Ruta inicial: Ahora abre la Landing Page pública (ya no te forzará al login)
  { path: '', component: LandingComponent, pathMatch: 'full' },
  
  // 3. Ruta para el Login (Se accede desde un botón en la Landing Page)
  { path: 'login', component: LoginComponent },

  {path: 'recuperar-password', component: RecuperarPasswordComponent},
  
  // 4. Rutas Privadas del Panel de Administración
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'gestion-usuarios', component: GestionUsuariosComponent },
  { path: 'subjects', component: SubjectComponent },
  { path: 'schedules', component: ScheduleComponent },
  
  // ¡AQUÍ ESTÁ LA CORRECCIÓN! (Plurales y con guion)
  { path: 'teachers', component: TeacherComponent },
  { path: 'persons', component: PersonComponent },
  { path: 'school-administrators', component: SchoolAdministratorComponent },

  // 5. Redirección de seguridad: Si escriben una URL rara, los devuelve a la vista pública
  { path: '**', redirectTo: '' }
];
