import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {LocalStorageService} from 'ngx-webstorage';
import {Observable} from 'rxjs';


@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(private storage: LocalStorageService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storage.retrieve('token');
    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    return next.handle(request);
  }
}
