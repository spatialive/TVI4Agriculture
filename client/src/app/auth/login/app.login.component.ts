import {Component} from '@angular/core';
import {LoginService} from '../../services/auth/login.service';
import {User} from '../../interfaces/user.interface';
import {LocalStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './app.login.component.html',
    styleUrls: ['./app.login.component.scss']
})
export class AppLoginComponent {
    email: string;
    password: string;

    constructor(
        private loginService: LoginService,
        private storage: LocalStorageService,
        private service: MessageService,
        private router: Router
    ) {
        this.email = '';
        this.password = '';
    }

    login() {
        const user: User = {
            email: this.email,
            password: this.password
        };
        this.loginService.login(user).subscribe(result => {
            if (result.data.hasOwnProperty('token')){
                this.storage.store('token', result.data.token);
                this.router.navigate(['/']).then(r => {});
            }
        }, error => {
            this.service.add({key: 'exp', severity: 'error', summary: 'Erro', detail: error});
        });
    }
}
