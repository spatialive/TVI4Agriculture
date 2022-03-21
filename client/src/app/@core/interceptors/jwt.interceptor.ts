import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {LocalStorageService} from 'ngx-webstorage';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import jwtDecode, {JwtPayload} from 'jwt-decode';
import {MessageService} from 'primeng/api';


@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(private storage: LocalStorageService, private router: Router, private service: MessageService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storage.retrieve('token');
    const ignoredRoutes: string[] = [
        '/api/auth/login',
        '/api/auth/signup'
    ];
    if (token) {
        const jwtToken = jwtDecode<JwtPayload>(token);
        const currentTimestamp = new Date().getTime() / 1000;
        const valid = jwtToken.exp > currentTimestamp;
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!valid){
            this.router.navigate(['/login']).then(r => {});
            if (!ignoredRoutes.includes(request.url)) {
                this.service.add({key: 'notification', severity: 'warn', summary: 'Atenção', detail: 'Sessão Expirada!'});
            }
        }
    }
    return next.handle(request);
  }
}
