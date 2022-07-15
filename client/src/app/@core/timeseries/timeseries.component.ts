import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MessageService} from 'primeng/api';
import * as moment from 'moment';
import {CampaignService} from '../../services/campaign.service';
import {TimeSeries} from '../interfaces/timeseries.interface';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import {UIChart} from 'primeng/chart/chart';
import * as saveAs from 'file-saver';

Chart.register(zoomPlugin);

@Component({
    selector: 'app-timeseries',
    templateUrl: './timeseries.component.html',
    styleUrls: ['timeseries.component.scss'],
    providers: [MessageService]
})

export class TimeseriesComponent implements OnInit {
    @ViewChild('chart') chart: UIChart;
    @Input() set tsData(value: TimeSeries) {
        if (value) {
            this._tsData = value;
            this.timeSeriesData = null;
            this.getTimeSeries();
        }
    }
    @Input() width = '100%';
    @Input() height = '50vh';
    exportData: any[] = [];
    timeSeriesData: any = {};
    timeSeriesOptions: any = {};
    loading: boolean;
    // tslint:disable-next-line:variable-name
    _tsData: TimeSeries;
    constructor(
        private messageService: MessageService,
        private campaignService: CampaignService,
    ) {
        this.loading = true;
        this.timeSeriesData = null;
        this.timeSeriesOptions = null;
    }
    ngOnInit() {}
    setChartOptions(lat, lon){
        this.timeSeriesOptions =  {
            plugins: {
                title: {
                    display: true,
                    text: `Serie Temporal Sentinel - EVI para o ponto [${lat}, ${lon}]`
                },
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
    }
    getTimeSeries(){
        this.loading = true;
        this.timeSeriesData = null;
        this.campaignService.timeseries(
            this._tsData.lon,
            this._tsData.lat,
            this._tsData.startDate,
            this._tsData.endDate).subscribe((result: any) => {
                this.exportData = [];
                this.setChartOptions(this._tsData.lat, this._tsData.lon);
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
                    ]
                };
                result?.dates.forEach((dt, i) => {
                    this.exportData.push({
                        data: moment(dt).format('DD/MM/YYYY') ,
                        evi: result?.evi[i],
                        precipitacao: result?.precipitation[i]
                    });
                });
                this.loading = false;
        }, error => {
            this.loading = false;
            this.messageService.add({
                key: 'timeseries',
                severity: 'error',
                summary: 'Timeseries',
                detail: error,
                life: 3000
            });
        });
    }

    exportExcel() {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.exportData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });
            this.saveAsExcelFile(excelBuffer, `timeserie_${this._tsData.lat}_${this._tsData.lon}`);
        });
    }
    exportCSV() {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.exportData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'csv',
                type: 'array'
            });
            this.saveAsCSVFile(excelBuffer, `timeserie_${this._tsData.lat}_${this._tsData.lon}`);
        });
    }
    saveAsCSVFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE =
            'data:text/csv;charset=utf-8';
        const EXCEL_EXTENSION = '.csv';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
    }
    saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
    }
    exportCanvas(elem) {
        const anchor = document.createElement('a');
        anchor.setAttribute('href', elem.chart.canvas.toDataURL());
        anchor.download = `timeserie_${this._tsData.lat}_${this._tsData.lon}_${new Date().getTime()}.png`;
        anchor.click();
    }
}
