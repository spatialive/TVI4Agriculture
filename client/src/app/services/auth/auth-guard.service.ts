import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import {MessageService} from 'primeng/api';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private storage: LocalStorageService,
    private service: MessageService
    ) {
  }
  canActivate() {
      const token = this.storage.retrieve('token');
      if (token){
          const jwtToken = jwtDecode<JwtPayload>(token);
          const currentTimestamp = new Date().getTime() / 1000;
          const valid = jwtToken.exp > currentTimestamp;

          if (!valid){
              this.router.navigate(['/login']).then(r => {
                  this.service.add({key: 'exp', severity: 'warn', summary: 'Atenção', detail: 'Sessão Expirada!'});
              });
          }
          return valid;
      } else {
          this.router.navigate(['/login']).then(r => {
              this.service.add({key: 'exp', severity: 'warn', summary: 'Atenção', detail: 'Acesso não autorizado!'});
          });
          return false;
      }
  }
}
