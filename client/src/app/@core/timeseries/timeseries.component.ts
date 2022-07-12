import {Component, Input, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import * as moment from 'moment';
import {CampaignService} from '../../services/campaign.service';
import {TimeSeries} from '../interfaces/timeseries.interface';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);

@Component({
    selector: 'app-timeseries',
    templateUrl: './timeseries.component.html',
    styleUrls: ['timeseries.component.scss'],
    providers: [MessageService]
})

export class TimeseriesComponent implements OnInit {
    @Input() set tsData(value: TimeSeries) {
        if (value) {
            this._tsData = value;
            this.getTimeSeries();
        }
    }
    @Input() width = '100%';
    @Input() height = '50vh';
    timeSeriesData: any = {};
    timeSeriesOptions: any = {};
    loading: boolean;
    // tslint:disable-next-line:variable-name
    _tsData: TimeSeries;
    constructor(
        private messageService: MessageService,
        private campaignService: CampaignService,
    ) {
        this.timeSeriesOptions =  {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy',
                        overScaleMode: 'y'
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true,
                        },
                        mode: 'xy',
                        overScaleMode: 'y'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                evi: {
                    id: 'evi',
                    type: 'linear',
                    position: 'left',
                },
                precipitation: {
                    id: 'precipitation',
                    type: 'linear',
                    position: 'right'
                }
            }
        };
        this.loading = true;
    }

    ngOnInit() {}
    getTimeSeries(){
        this.loading = true;
        this.timeSeriesData = null;
        this.campaignService.timeseries(
            this._tsData.lon,
            this._tsData.lat,
            this._tsData.startDate,
            this._tsData.endDate).subscribe((result: any) => {
            this.timeSeriesData = {
                labels: result?.dates.map(d => moment(d).format('DD/MM/YYYY')),
                datasets: [
                    {
                        yAxisID: 'evi',
                        data: result?.evi,
                        label: 'EVI Suavizado por Savitzky–Golay',
                        borderColor: '#009933',
                        backgroundColor: '#009933',
                        type: 'line',
                        fill: false
                    },
                    {
                        yAxisID: 'precipitation',
                        data: result?.precipitation,
                        label: 'Precipitação  CHIRPS',
                        borderColor: '#0a5291',
                        backgroundColor: 'rgba(80,103,180)',
                        type: 'bar',
                        fill: true
                    }
                ],
                options: {
                    title: {
                        display: false,
                        text: `Serie Temporal Sentinel - EVI para o ponto [{{lat}},  {{lon}}]`
                    }
                }
            };
            this.loading = false;
        }, error => {
            this.loading = false;
            this.messageService.add({
                id: 'timeseries',
                severity: 'error',
                summary: 'Timeseries',
                detail: error,
                life: 3000
            });
        });
    }
}
