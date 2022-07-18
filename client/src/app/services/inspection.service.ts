import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { map } from 'rxjs/operators';
import {Inspection} from '../@core/interfaces/inspection.interface';
import {environment} from '../../environments/environment';
@Injectable({
    providedIn: 'root',
})
export class InspectionService {

    private apiURL = '/api/inspection/';

    httpOptions = {
        headers: new HttpHeaders({
            Authorization: `Bearer ${environment.PLANET_KEY}`,
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
    getLastInspection(campaignId: number, userId: number): Observable<any> {
        return this.httpClient.get<Inspection>(this.apiURL + 'lastInspection/' + campaignId + '/' + userId)
            .pipe(map(response => response))
            .pipe(catchError(this.errorHandler),
            );
    }

    create(inspection: Inspection): Observable<any> {
        return this.httpClient.post<Inspection>(
            this.apiURL + 'create',
            JSON.stringify(inspection),
            this.httpOptions,
        ).pipe(
            catchError(this.errorHandler),
        );
    }

    createMany(inspections: Inspection[]): Observable<any> {
        return this.httpClient.post<Inspection[]>(
            this.apiURL + 'createMany',
            JSON.stringify({ list: inspections}),
            this.httpOptions,
        ).pipe(
            catchError(this.errorHandler),
        );
    }

    update(inspection: Inspection): Observable<any> {
        return this.httpClient.put<Inspection>(
            this.apiURL + 'update',
            JSON.stringify(inspection),
            this.httpOptions,
        ).pipe(
            catchError(this.errorHandler),
        );
    }

    updateMay(inspections: Inspection[]): Observable<any> {
        return this.httpClient.put<Inspection[]>(
            this.apiURL + 'update',
            JSON.stringify({ list: inspections}),
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

    deleteMany(inspections: Inspection[]): Observable<any> {
        return this.httpClient.post<Inspection[]>(
            this.apiURL + 'deleteMany',
            JSON.stringify({ list: inspections}),
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
