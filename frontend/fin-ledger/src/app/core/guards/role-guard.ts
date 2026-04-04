import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[];
  const userRole = auth.currentUser()?.role;

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/not-found']);
  return false;
};
