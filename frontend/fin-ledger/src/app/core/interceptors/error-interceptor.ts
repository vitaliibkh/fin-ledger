import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/toast';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'An unexpected error occurred.';

      if (error.error instanceof ErrorEvent) {
        errorMsg = `Error: ${error.error.message}`;
      } else {
        if (error.status === 401) {
          errorMsg = 'Session expired. Please log in again.';
          router.navigate(['/auth']);
        } else if (error.status === 403) {
          errorMsg = 'You do not have permission to perform this action.';
        } else if (error.status === 400) {
          errorMsg = error.error?.message || 'Invalid data submitted.';
        } else if (error.status >= 500) {
          errorMsg = 'Server disconnected. Please try again later.';
        }
      }

      toastService.show(errorMsg, 'error');

      return throwError(() => error);
    })
  );
};
