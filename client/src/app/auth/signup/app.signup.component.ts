import {Component} from '@angular/core';
import {MessageService} from 'primeng/api';
import {LoginService} from '../../services/auth/login.service';
import {User} from '../../interfaces/user.interface';
import {Router} from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: 'app.signup.component.html',
    styleUrls: ['app.signup.component.scss'],
    providers: [MessageService]
})
export class AppSignupComponent {
    name: string;
    email: string;
    password: string;
    prePassword: string;
    valid: boolean;
    emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    constructor(
        private service: MessageService,
        private loginService: LoginService,
        private router: Router
    ) {
        this.valid = false;
        this.name = '';
        this.email = '';
        this.prePassword = '';
        this.password = '';
    }

    validateName() {
        if (this.name === '') {
            this.service.add({severity: 'error', summary: 'Erro', detail: 'Informe o nome do usuário!', life: 3000});
        }
    }

    validateEmail() {
        if (!this.emailRegex.test(this.email)) {
            this.service.add({severity: 'error', summary: 'Erro', detail: 'Informe um e-mail válido!', life: 3000});
        }
    }

    validatePassword() {
        if (this.prePassword !== this.password) {
            this.service.add({severity: 'error', summary: 'Erro', detail: 'Senha divergentes!', life: 3000});
        }
        this.valid = this.prePassword === this.password && this.emailRegex.test(this.email) && this.name !== '';
    }

    signup() {
        const user: User = {
            name: this.name,
            email: this.email,
            password: this.password
        };
        this.loginService.signup(user).subscribe(result => {
            this.router.navigate(['/login']).then(r => {
            });
            this.service.add({
                key: 'exp',
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta criada com sucesso!'
            });
        }, error => {
            this.service.add({key: 'exp', severity: 'error', summary: 'Erro', detail: error, life: 3000});
        });
    }
}
