import { Routes } from '@angular/router';
import { AdminComponent } from '../features/admin/admin.component';
import { LoginComponent } from '../features/auth/login/login.component';
import { RegisterComponent } from '../features/auth/register/register.component';
import { AboutComponent } from '../features/about/about.component';
import { MoviesTableComponent } from '../features/admin/movies-table.component';
import { HomeComponent } from '../features/home/home/home.component';
import { TheatersTableComponent } from '../features/admin/theaters-table.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { OwnerGuard } from '../core/guards/owner.guard'
import { PartnerDashboardComponent } from '../features/partner-dashboard/partner-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'movies', pathMatch: 'full' },
      { path: 'movies', component: MoviesTableComponent },
      { path: 'theaters', component: TheatersTableComponent }
    ]
  },
  {
    path: 'partner-dashboard',
    component: PartnerDashboardComponent,
    canActivate: [OwnerGuard]
  }
];
