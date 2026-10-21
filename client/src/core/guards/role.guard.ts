import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const roles = next.data['roles'] as string[];
    const userRole = this.authService.getRole();

    if (userRole && roles.includes(userRole)) {
      return true;
    }

    // Redirect to home if the user doesn't have the required role
    this.router.navigate(['/home']);
    return false;
  }
}
