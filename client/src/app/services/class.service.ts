import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Class} from '../@core/interfaces/class.interface';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root',
})
export class ClassService {

    private apiURL = '/api/class/';

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    constructor(private httpClient: HttpClient) {}

    all(): Observable<any> {
        return this.httpClient.get<any>(this.apiURL + 'all')
            .pipe(map(response => response))
            .pipe(catchError(this.errorHandler),
            );
    }

    get(id: number): Observable<any> {
        return this.httpClient.get<number>(this.apiURL + id)
            .pipe(map(response => response))
            .pipe(catchError(this.errorHandler),
            );
    }

    create(classe: Class): Observable<any> {
        return this.httpClient.post<Class>(
            this.apiURL + 'create',
            JSON.stringify(classe),
            this.httpOptions,
        ).pipe(
            catchError(this.errorHandler),
        );
    }

    update(classe: Class): Observable<any> {
        return this.httpClient.put<Class>(
            this.apiURL + 'update',
            JSON.stringify(classe),
            this.httpOptions,
        ).pipe(
            catchError(this.errorHandler),
        );
    }

    delete(id: number): Observable<any> {
        return this.httpClient.delete<number>(this.apiURL + 'delete/' + id)
            .pipe(map(response => response))
            .pipe(catchError(this.errorHandler),
            );
    }

    deleteMany(classes: Class[]): Observable<any> {
        return this.httpClient.post<Class>(
            this.apiURL + 'deleteMany',
            JSON.stringify({ list: classes}),
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
