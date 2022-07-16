import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {latLng, Marker, marker, tileLayer, divIcon, Map} from 'leaflet';
import * as moment from 'moment';
import {CampaignService} from '../services/campaign.service';
import {Point} from '../@core/interfaces/point.interface';
import {PointInfo} from '../@core/interfaces/point.info.interface';
import {TimeSeries} from '../@core/interfaces/timeseries.interface';
import {Car} from '../@core/interfaces/car.interface';

@Component({
    templateUrl: './public.component.html',
    styleUrls: ['../pages/tabledemo.scss', 'public.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class PublicComponent implements OnInit {
    planetMosaics: any[];
      layersControl = {
        baseLayers: null,
        overlays: {
            'Google Maps': tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 19 }),
            'Google Satellite': tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 19 }),
            'Sentinel-2 cloudless 2018':  tileLayer('https://s2maps-tiles.eu/wmts?layer=s2cloudless-2018_3857&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}', { maxZoom: 19, attribution: ' | <a href="https://s2maps.eu" target="_blank">Sentinel-2 cloudless</a> - by  <a href="https://eox.at/" target="_blank">EOX IT Services</a> GmbH'}),
            'Sentinel-2 cloudless 2019':  tileLayer('https://s2maps-tiles.eu/wmts?layer=s2cloudless-2019_3857&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}', { maxZoom: 19, attribution: ' | <a href="https://s2maps.eu" target="_blank">Sentinel-2 cloudless</a> - by  <a href="https://eox.at/" target="_blank">EOX IT Services</a> GmbH'}),
            'Sentinel-2 cloudless 2020':  tileLayer('https://s2maps-tiles.eu/wmts?layer=s2cloudless-2020_3857&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}', { maxZoom: 19, attribution: ' | <a href="https://s2maps.eu" target="_blank">Sentinel-2 cloudless</a> - by  <a href="https://eox.at/" target="_blank">EOX IT Services</a> GmbH'}),
            'Sentinel-2 cloudless 2021':  tileLayer('https://s2maps-tiles.eu/wmts?layer=s2cloudless-2021_3857&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}', { maxZoom: 19, attribution: ' | <a href="https://s2maps.eu" target="_blank">Sentinel-2 cloudless</a> - by  <a href="https://eox.at/" target="_blank">EOX IT Services</a> GmbH'})
        }
    };
    startDate: string;
    endDate: string;
    options = {
        layers: [
            tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 19 })
        ],
        zoom: 3,
        minZoom: 4,
        maxZoom: 16,
        center: latLng(-14.235004, -51.92528)
    };
    optionsMoisaicMap = {
        zoom: 10,
        minZoom: 4,
        maxZoom: 16,
        center: latLng(-14.235004, -51.92528)
    };
    mosaicsLayers: any[];
    loadingPoints: boolean;
    mapPoints: any[];
    timeSeriesOptions: any;
    point: Point;
    markerPoint = '<svg width="60" height="60" viewBox="0 0 42 42" preserveAspectRatio="xMidYMid meet" fill="#66ff66"><path d="M19.8.7c.6.2 1.8.2 2.5 0 .6-.3.1-.5-1.3-.5s-1.9.2-1.2.5zM20 9c0 4 .4 7 1 7s1-3 1-7-.4-7-1-7-1 3-1 7zm-6 6.7c0 1 .4 1.4.8.8s1.1-1.3 1.6-1.8c.5-.4.2-.7-.7-.7-1 0-1.7.8-1.7 1.7zm11.6-1c.5.5 1.2 1.2 1.6 1.8s.8.2.8-.8c0-.9-.7-1.7-1.7-1.7-.9 0-1.2.3-.7.7zM.2 21c0 1.4.2 1.9.5 1.2.2-.6.2-1.8 0-2.5-.3-.6-.5-.1-.5 1.3zm41 0c0 1.4.2 1.9.5 1.2.2-.6.2-1.8 0-2.5-.3-.6-.5-.1-.5 1.3zM2 21c0 .6 3 1 7 1s7-.4 7-1-3-1-7-1-7 .4-7 1zm18 0a1.08 1.08 0 0 0 1 1c.6 0 1-.5 1-1a.94.94 0 0 0-1-1c-.5 0-1 .4-1 1zm6 0c0 .6 3 1 7 1s7-.4 7-1-3-1-7-1-7 .4-7 1zm-12 5.3c0 1 .8 1.7 1.8 1.7.9 0 1.3-.4.7-.8-.5-.4-1.3-1.1-1.7-1.6-.5-.5-.8-.2-.8.7zm12.2.2c-1.1 1.2-1 1.5.3 1.5a1.54 1.54 0 0 0 1.5-1.5c0-1.8-.2-1.8-1.8 0zM20 33c0 4 .4 7 1 7s1-3 1-7-.4-7-1-7-1 3-1 7zm-.2 8.7c.6.2 1.8.2 2.5 0 .6-.3.1-.5-1.3-.5s-1.9.2-1.2.5z"/></svg>';
    pointBounds: any = null;
    map: Map = null;
    showTimeSeries: boolean;
    showPointDialog: boolean;
    pointInfo: PointInfo;
    minDateValue: Date;
    maxDateValue: Date;
    submitted: boolean;
    selectedMosaic: any;
    pointTimeSeries: TimeSeries;
    carPointInfo: Car[];
    showCarInfo: boolean;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private campaignService: CampaignService,
    ) {
        this.loadingPoints = false;
        this.showTimeSeries = false;
        this.submitted = false;
        this.showPointDialog = false;
        this.mapPoints = [];
        this.mosaicsLayers = [];
        this.startDate = null;
        this.endDate = null;
        this.selectedMosaic = null;
        this.showCarInfo = false;
        this.carPointInfo = [];
    }

    ngOnInit() {
        this.timeSeriesOptions =  {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
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
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
        this.getPlanetMosaics();
        const currentYear = new Date().getFullYear();
        this.minDateValue = new Date('2019-01-01');
        this.maxDateValue = new Date(currentYear + '-01-01');
    }

    changeMosaic(evt) {
        this.mosaicsLayers = [];
        if (this.point){
            const pointLayer: Marker = this.buildMarker(this.point.lat, this.point.lon);
            // this.pointBounds = latLng(this.point.lat, this.point.lon).toBounds(1000);
            this.mosaicsLayers.push(pointLayer);
        }
        this.mosaicsLayers.push(tileLayer(evt.value,
            {maxZoom: 18, attribution: 'TVI4Agriculture | NICFI - Norway\'s International Climate and Forests Initiative Satellite Data Program'}
        ));
    }

    getPlanetMosaics() {
        this.planetMosaics = [];
        this.campaignService.mosaics().subscribe(mosaics => {
           mosaics.forEach(mos => {
                if (mos.name.includes('planet_medres_normalized_analytic_') && mos.name.includes('mosaic')){
                    let name = mos.name.split('planet_medres_normalized_analytic_')[1].split('_mosaic')[0];
                    if ( name.includes('_')){
                        name = name.replace('_', ' - ');
                    }
                    mos.name = name;
                    this.planetMosaics.push(mos);
                }
           });
           this.mosaicsLayers.push(tileLayer(this.planetMosaics[30]._links.tiles,
               {maxZoom: 18, attribution: 'NICFI - Norway\'s International Climate and Forests Initiative Satellite Data Program'}
           ));
        });
    }
    buildMarker(lat, lon){
       return  marker([lat, lon], {
            icon: divIcon(
                {
                    html: this.markerPoint,
                    iconSize: [60, 60]
                }
            )
        });
    }
    onClick(evt){
        if (this.startDate && this.endDate) {
            this.submitted = true;
            this.point = {
                lon: String(evt.latlng.lng),
                lat: String(evt.latlng.lat),
            };
            this.pointTimeSeries = {
                lon: evt.latlng.lng,
                lat: evt.latlng.lat,
                startDate: moment(this.startDate).format('YYYY-MM-DD'),
                endDate: moment(this.endDate).format('YYYY-MM-DD')
            };
            this.mosaicsLayers = [];
            const pointLayer: Marker = this.buildMarker(this.point.lat, this.point.lon);
            // this.pointBounds = latLng(this.point.lat, this.point.lon).toBounds(1000);
            this.mosaicsLayers.push(pointLayer);
            this.mosaicsLayers.push(tileLayer(this.selectedMosaic ? this.selectedMosaic : this.planetMosaics[30]._links.tiles,
                {maxZoom: 18, attribution: 'TVI4Agriculture | NICFI - Norway\'s International Climate and Forests Initiative Satellite Data Program'}
            ));
            this.showTimeSeries = true;
            this.getPointInfo();
            this.getCarInfo();
        } else {
            this.messageService.add({
                life: 2000,
                severity: 'warn',
                summary: 'Atenção',
                detail: 'O preenchimento do periodo de interesse é obrigatório'
            });
        }
    }
    getPointInfo() {
        this.campaignService.pointInfo(this.parse(this.point.lon), this.parse(this.point.lat)).subscribe((pointInfo) => {
            this.pointInfo = pointInfo[0];
        });
    }
    getCarInfo() {
        this.campaignService.carInfo(this.parse(this.point.lon), this.parse(this.point.lat)).subscribe((result) => {
            this.carPointInfo = result;
            if (this.carPointInfo.length > 0) {
                this.carPointInfo = this.carPointInfo.map(car => {
                    car.data_ref = moment(car.data_ref).format('DD/MM/YYYY');
                    return car;
                });
            }
        });
    }
    parse(value: string): number {
        return parseFloat(value);
    }
}
