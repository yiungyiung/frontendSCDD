import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/AuthService/auth.service';
import { Role } from '../model/role';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRoles = route.data['roles'] as Array<Role>;
    const userRole = this.authService.getRoleFromToken(token);

    if (expectedRoles.includes(userRole)) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
