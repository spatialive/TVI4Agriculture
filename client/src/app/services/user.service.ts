import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root',
})
export class UserService {

    private apiURL = '/api/users/';

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    constructor(private httpClient: HttpClient) {}

    all(): Observable<any> {
        return this.httpClient.get<any>(this.apiURL + 'all', this.httpOptions)
            .pipe(map(response => response))
            .pipe(catchError(this.errorHandler),
            );
    }
    get(id: number): Observable<any> {
        return this.httpClient.get<number>(this.apiURL + id, this.httpOptions)
            .pipe(map(response => response))
            .pipe(catchError(this.errorHandler),
            );
    }
    getPointsInspected(id: number): Observable<any> {
        return this.httpClient.get<number>(this.apiURL + 'getPointsInspected/' + id, this.httpOptions)
            .pipe(map(response => response))
            .pipe(catchError(this.errorHandler),
            );
    }
    errorHandler(error: HttpErrorResponse) {
        const errorMessage = `Código do erro: ${error.status} - Mensagem: ${error.error.error}`;
        return throwError(errorMessage);
    }
}
