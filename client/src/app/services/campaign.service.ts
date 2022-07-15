import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { map } from 'rxjs/operators';
import {Campaign} from '../@core/interfaces/campaign.interface';
import {PointInfo} from '../@core/interfaces/point.info.interface';
import {Car} from "../@core/interfaces/car.interface";

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

    allByUser(userId: number): Observable<any> {
        return this.httpClient.get<any>(this.apiURL + 'allByUser/' + userId)
            .pipe(map(response => response))
            .pipe(catchError(this.errorHandler),
            );
    }

    mosaics(): Observable<any> {
        return this.httpClient.get<any>(this.apiURL + 'mosaics')
            .pipe(map(response => response))
            .pipe(catchError(this.errorHandler),
            );
    }
    timeseries(lon: number, lat: number, start: string, end: string): Observable<any> {
        return this.httpClient.get<any>(
            this.apiURL + 'timeseries' + '?lon=' + lon + '&lat=' + lat + '&start_date=' + start + '&end_date=' + end)
            .pipe(map(response => response))
            .pipe(catchError(this.errorHandler),
            );
    }
    pointInfo(lon: number, lat: number): Observable<PointInfo> {
        return this.httpClient.get<any>(
            '/api/point-info' + '?lon=' + lon + '&lat=' + lat)
            .pipe(map(response => response))
            .pipe(catchError(this.errorHandler),
            );
    }

    carInfo(lon: number, lat: number): Observable<Car[]> {
        return this.httpClient.get<any>(
            '/api/car' + '?lon=' + lon + '&lat=' + lat)
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

    downloadSHP(campaignId: number): Observable<Blob> {
        return this.httpClient.get('/api/shp?campaignId=' + campaignId, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
            }),
            responseType: 'blob'
        } );
    }

    errorHandler(error: HttpErrorResponse) {
        const errorMessage = `Código do erro: ${error.status} - Mensagem: ${error.error.error}`;
        return throwError(errorMessage);
    }
}
