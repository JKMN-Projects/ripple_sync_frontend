import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authentication } from './services/authentication';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { DateTime } from 'luxon';

let refreshInProgress = false;

const logDebug = (message: string, ...optionalParams: any[]) => {
  console.debug("[RefreshTokenInterceptor] " + message, ...optionalParams);
}

const attemptRefresh = (authService: Authentication, req: HttpRequest<any>, next: HttpHandlerFn) => {
  if (!refreshInProgress) {
    refreshInProgress = true;
    return authService.refreshToken().pipe(
      switchMap(() => {
        logDebug("Token refreshed. Retrying original request.");
        refreshInProgress = false;
        return next(req);
      }),
      catchError(err => {
        logDebug("Refresh token request failed. Logging out user.");
        authService.logout();
        refreshInProgress = false;
        return throwError(() => err);
      })
    )
  }
  logDebug("Refresh already in progress. Proceeding without refreshing.");
  return next(req);
}

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Authentication);
  const isAuthenticated = authService.isAuthenticated();
  const tokenIsCloseToExpiry = DateTime.now().plus({ minutes: 1 }).toMillis() >= authService.tokenExpiryTime;
  const isRefreshableRequest = !req.url.includes("authentication");

  if (isAuthenticated && isRefreshableRequest && tokenIsCloseToExpiry) {
    logDebug("Token is close to expiry. Attempting to refresh.");
    return attemptRefresh(authService, req, next);
  }
  return next(req).pipe(catchError(error => {
    logDebug("Intercepted error:", error);
    if(
      isRefreshableRequest && 
      error instanceof HttpErrorResponse &&
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
    })
  );
};