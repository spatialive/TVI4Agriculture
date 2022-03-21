import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Harvest} from '../@core/interfaces/harvest.interface';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root',
})
export class HarvestService {

    private apiURL = '/api/harvest/';

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

    create(harvest: Harvest): Observable<any> {
        return this.httpClient.post<Harvest>(
            this.apiURL + 'create',
            JSON.stringify(harvest),
            this.httpOptions,
        ).pipe(
            catchError(this.errorHandler),
        );
    }

    update(harvest: Harvest): Observable<any> {
        return this.httpClient.put<Harvest>(
            this.apiURL + 'update',
            JSON.stringify(harvest),
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

    deleteMany(harvests: Harvest[]): Observable<any> {
        return this.httpClient.post<Harvest>(
            this.apiURL + 'deleteMany',
            JSON.stringify({ list: harvests}),
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
