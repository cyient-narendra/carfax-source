import {

    HttpEvent,
   
    HttpInterceptor,
   
    HttpHandler,
   
    HttpRequest,
   
    HttpResponse,
   
    HttpErrorResponse
   
   } from '@angular/common/http';
   
   import { Observable, throwError } from 'rxjs';
   
   import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
   
   export class HttpErrorInterceptor implements HttpInterceptor {
   
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
      return next.handle(request)
   
        .pipe(
   
          retry(1),
   
          catchError((error: HttpErrorResponse) => {
   
            let errorMessage :any;
   
            if (error.error instanceof ErrorEvent) {
   
              // client-side error
   
               errorMessage = Error(error.error.message);
   
            } else {
   
              // server-side error
   
              errorMessage = Number(error.status) + '_'+error.message;
   
            }
   
            Swal.fire(errorMessage);
   
            return throwError(errorMessage);
   
          })
   
        )
   
    }
   
   }