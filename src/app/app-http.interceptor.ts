import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './core/services';
import { Router } from '@angular/router';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {


  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // if (!req.headers.has('Content-Type')) {
    //   req = req.clone({
    //     headers: req.headers.set('Content-Type', 'application/json')
    //   });
    // }


    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status == 0) {
          alert("server is not responding... (probably socket hang up)");
        }
        if (error && error.status === 401) {

          this.authenticationService.logout();
          window.location.href = '/';

          // 401 errors will most likely be returned because we have an expired token that we need to refresh.
          // if (this.refreshTokenInProgress) {
          //   // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
          //   // which means the new token is ready and we can retry the request again
          //   return this.refreshTokenSubject.pipe(
          //     filter(result => result !== null),
          //     take(1),
          //     switchMap(() => next.handle(this.addAuthenticationToken(req)))
          //   );
          // } else {
          //   this.refreshTokenInProgress = true;

          //   // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
          //   this.refreshTokenSubject.next(null);

          //   return this.refreshAccessToken().pipe(
          //     switchMap((success: boolean) => {
          //       this.refreshTokenSubject.next(success);
          //       return next.handle(this.addAuthenticationToken(req));
          //     }),
          //     // When the call to refreshToken completes we reset the refreshTokenInProgress to false
          //     // for the next time the token needs to be refreshed
          //     finalize(() => this.refreshTokenInProgress = false)
          //   );
          // }
        }
        else {
          return throwError(error);
        }
      })
    );
  }
}
