import { Routes } from '@angular/router';
import { AdminComponent } from '../features/admin/admin.component';
import { LoginComponent } from '../features/auth/login/login.component';
import { RegisterComponent } from '../features/auth/register/register.component';
import { AboutComponent } from '../features/about/about.component';
import { MoviesTableComponent } from '../features/admin/movies-table.component';
import { HomeComponent } from '../features/home/home.component';
import { TheatersTableComponent } from '../features/admin/theaters-table.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { OwnerGuard } from '../core/guards/owner.guard'
import { PartnerDashboardComponent } from '../features/partner-dashboard/partner-dashboard.component';
import { PartnerTheaterDetailsComponent } from '../features/partner-dashboard/partner-theater-details.component';
import { MovieDetailsComponent } from '../features/movie-details/movie-details.component';
import { ShowDetailsComponent } from '../features/show-details/show-details.component';
import { BookingSuccessComponent } from '../features/show-details/booking-success.component';
import { MyBookingsComponent } from '../features/bookings/my-bookings.component';
import { ForgotPasswordComponent } from '../features/forget-password/forgot-password.component';
import { guestGuard } from '../core/guards/guest.gurad';

export const routes: Routes = [
  { path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  { path: '', component: LoginComponent, canActivate: [guestGuard] },
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
  },
  {
    path: 'partner-dashboard/theater/:theaterId',
    component: PartnerTheaterDetailsComponent,
    canActivate: [OwnerGuard] // same guard
  },
  {
    path: 'movies/:movieId',
    component: MovieDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shows/:showId',
    component: ShowDetailsComponent,
    canActivate: [AuthGuard]
  },
  { path: 'booking-success',
    component: BookingSuccessComponent,
    canActivate: [AuthGuard]
  },
  { path: 'my-bookings',
    component: MyBookingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  }  
];
