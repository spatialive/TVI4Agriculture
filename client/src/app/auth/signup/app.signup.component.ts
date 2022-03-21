import {Component} from '@angular/core';
import {MessageService} from 'primeng/api';
import {LoginService} from '../../services/auth/login.service';
import {User} from '../../@core/interfaces/user.interface';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {Validators} from '@angular/forms';
import {MustMatch} from '../../@core/validators/must-match.validator';

@Component({
    selector: 'app-signup',
    templateUrl: 'app.signup.component.html',
    styleUrls: ['app.signup.component.scss'],
    providers: [MessageService]
})
export class AppSignupComponent {

    signupFormGroup: FormGroup;
    user: User = {name: '', email: '', password: '', confirmPassword: ''};

    constructor(
        private service: MessageService,
        private loginService: LoginService,
        private router: Router
    ) {

        this.signupFormGroup = new FormGroup({
                name: new FormControl(this.user.name, [
                    Validators.required
                ]),
                email: new FormControl(this.user.email, [
                    Validators.required,
                    Validators.email,
                    Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
                ]),
                password: new FormControl(this.user.password, [
                    Validators.required
                ]),
                confirmPassword: new FormControl(this.user.confirmPassword, [
                    Validators.required
                ])
            },
            {
                validators: [MustMatch('password', 'confirmPassword')]
            });
    }

    get name() { return this.signupFormGroup.get('name'); }
    get email() { return this.signupFormGroup.get('email'); }
    get password() { return this.signupFormGroup.get('password'); }
    get confirmPassword() { return this.signupFormGroup.get('confirmPassword'); }

    signup() {
        if (this.signupFormGroup.valid) {
            this.user = {
                name: this.name.value,
                email: this.email.value,
                password: this.password.value
            };
            this.loginService.signup(this.user).subscribe(result => {
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
        return !this.signupFormGroup.get(field).valid && this.signupFormGroup.get(field).touched;
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
