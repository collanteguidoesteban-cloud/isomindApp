import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
      const token = localStorage.getItem('token');
      if (token) {
        const requestConToken = request.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
        return next.handle(requestConToken);
      } return next.handle(request);
    }
}
