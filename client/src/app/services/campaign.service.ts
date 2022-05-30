import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { map } from 'rxjs/operators';
import {Campaign} from '../@core/interfaces/campaign.interface';
@Injectable({
    providedIn: 'root',
})
export class CampaignService {

    private apiURL = '/api/campaign/';

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

    create(campaign: Campaign): Observable<any> {
        return this.httpClient.post<Campaign>(
            this.apiURL + 'create',
            JSON.stringify(campaign),
            this.httpOptions,
        ).pipe(
            catchError(this.errorHandler),
        );
    }

    update(campaign: Campaign): Observable<any> {
        return this.httpClient.put<Campaign>(
            this.apiURL + 'update',
            JSON.stringify(campaign),
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

    deleteMany(campaigns: Campaign[]): Observable<any> {
        return this.httpClient.post<Campaign>(
            this.apiURL + 'deleteMany',
            JSON.stringify({ list: campaigns}),
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
