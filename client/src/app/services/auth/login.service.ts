import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {User} from '../../@core/interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class LoginService {

    private apiURL = '/api/auth/';

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    constructor(private httpClient: HttpClient) {
    }

    login(user: User): Observable<any> {
        return this.httpClient.post<User>(
            this.apiURL + 'login',
            JSON.stringify(user),
            this.httpOptions,
        ).pipe(
            catchError(this.errorHandler),
        );
    }

    signup(user: User): Observable<any> {
        return this.httpClient.post<User>(
            this.apiURL + 'signup',
            JSON.stringify(user),
            this.httpOptions,
        ).pipe(
            catchError(this.errorHandler),
        );
    }

    errorHandler(error: HttpErrorResponse) {
        const errorMessage = `Código do erro: ${error.status} - Mensagem: ${error.error.error}`;
        return throwError(errorMessage);
    }
}
