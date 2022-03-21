import {Component} from '@angular/core';
import {LoginService} from '../../services/auth/login.service';
import {User} from '../../@core/interfaces/user.interface';
import {LocalStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './app.login.component.html',
    styleUrls: ['./app.login.component.scss']
})
export class AppLoginComponent {
    loginFormGroup: FormGroup;
    user: User = {name: '', email: '', password: '', confirmPassword: ''};

    constructor(
        private loginService: LoginService,
        private storage: LocalStorageService,
        private service: MessageService,
        private router: Router
    ) {
        this.loginFormGroup = new FormGroup({
            email: new FormControl(this.user.email, [
                Validators.required,
                Validators.email,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ]),
            password: new FormControl(this.user.password, [
                Validators.required
            ])
        });
    }
    get email() { return this.loginFormGroup.get('email'); }
    get password() { return this.loginFormGroup.get('password'); }

    login() {
        if (this.loginFormGroup.valid) {
            this.user = {
                email: this.email.value,
                password: this.password.value
            };
            this.loginService.login(this.user).subscribe(result => {
                if (result.data.hasOwnProperty('token')){
                    this.storage.store('token', result.data.token);
                    this.router.navigate(['/']).then(r => {});
                }
            }, error => {
                this.service.add({key: 'exp', severity: 'error', summary: 'Erro', detail: error});
            });
        } else {
            this.service.add({
                key: 'exp',
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Preencha o formulário corretamento!',
                life: 3000
            });
        }
    }

    isFieldValid(field: string) {
        return !this.loginFormGroup.get(field).valid && this.loginFormGroup.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'ng-dirty': this.isFieldValid(field),
            'ng-invalid': this.isFieldValid(field)
        };
    }

    displayContainerFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
        };
    }
}
