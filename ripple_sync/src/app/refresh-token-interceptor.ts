import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authentication } from './services/authentication';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';

const logDebug = (message: string, ...optionalParams: any[]) => {
  console.debug("[RefreshTokenInterceptor] " + message, ...optionalParams);
}

const attemptRefresh = (authService: Authentication, req: HttpRequest<any>, next: HttpHandlerFn) => {
  return authService.refreshToken().pipe(
    switchMap(() => {
      logDebug("Token refreshed. Retrying original request.");
      return next(req);
    }),
    catchError(err => {
      logDebug("Token refresh failed or retrying original request failed.", err);
      if(err.status === 400 || err.status === 401) {
        logDebug("Refresh token invalid or expired. Logging out user.");
        authService.logout();
      }
      return throwError(() => err);
    })
  )
}

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Authentication);
  const isAuthenticated = authService.isAuthenticated();
  // TODO: Check if the token is close to expiry to avoid unnecessary error calls
  return next(req).pipe(catchError(error => {
    logDebug("Intercepted error:", error);
    if(
      error instanceof HttpErrorResponse && 
      !req.url.includes("authentication") && 
      error.status === 401
    ) {
      logDebug("401 Unauthorized detected. Attempting to refresh token.");
      if(isAuthenticated) {
        return attemptRefresh(authService, req, next);
      }
      logDebug("User is not authenticated. Not attempting to refresh token.");
      return next(req);
    }
    return throwError(() => error);
  }));
};