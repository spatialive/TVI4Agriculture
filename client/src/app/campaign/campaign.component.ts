import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Class} from '../@core/interfaces/class.interface';
import {latLng, Marker, marker, tileLayer, divIcon, Map} from 'leaflet';
import {Campaign} from '../@core/interfaces/campaign.interface';
import {CampaignService} from '../services/campaign.service';
import {Harvest} from '../@core/interfaces/harvest.interface';
import {ClassService} from '../services/class.service';
import {HarvestService} from '../services/harvest.service';
import {LocalStorageService} from 'ngx-webstorage';
import {User} from '../@core/interfaces/user.interface';
import jwtDecode from 'jwt-decode';
import {Point} from '../@core/interfaces/point.interface';
import {Inspection} from '../@core/interfaces/inspection.interface';
import {InspectionService} from '../services/inspection.service';
import * as moment from 'moment';
import {TimeSeries} from '../@core/interfaces/timeseries.interface';
import {PointInfo} from '../@core/interfaces/point.info.interface';
import {Mode} from '../@core/interfaces/mode.type';
import {Car} from '../@core/interfaces/car.interface';
import * as saveAs from 'file-saver';

@Component({
    templateUrl: './campaign.component.html',
    styleUrls: ['../pages/tabledemo.scss', 'campaign.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class CampaignComponent implements OnInit {
    inepectionMode: Mode;
    campaign: Campaign;
    campaigns: Campaign[];
    campaignDialog: boolean;
    selectedCampaigns: Campaign[];
    campaignInspectionDialog: boolean;
    currentPoint: number;
    classes: Class[];
    harvests: Harvest[];
    points: Point[];
    inspections: Inspection[];
    submitted: boolean;
    cols: any[];
    planetMosaics: any[];
    colsTablePoints: any[];
    selectedTypeClass: any = {name: 'Dinâmicas', value: 'DYNAMIC'};
    typesClass: any[] = [
        {name: 'Dinâmicas', value: 'DYNAMIC'},
        {name: 'Áreas Irrigadas e Não Irrigadas', value: 'IRRIGATED_NON_IRRIGATED'}
    ];
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
    user: User;
    loadingPoints: boolean;
    mapPoints: any[];
    timeSeriesOptions: any;

    timeSeriesData: any;
    markerPoint = '<svg width="60" height="60" viewBox="0 0 42 42" preserveAspectRatio="xMidYMid meet" fill="#66ff66"><path d="M19.8.7c.6.2 1.8.2 2.5 0 .6-.3.1-.5-1.3-.5s-1.9.2-1.2.5zM20 9c0 4 .4 7 1 7s1-3 1-7-.4-7-1-7-1 3-1 7zm-6 6.7c0 1 .4 1.4.8.8s1.1-1.3 1.6-1.8c.5-.4.2-.7-.7-.7-1 0-1.7.8-1.7 1.7zm11.6-1c.5.5 1.2 1.2 1.6 1.8s.8.2.8-.8c0-.9-.7-1.7-1.7-1.7-.9 0-1.2.3-.7.7zM.2 21c0 1.4.2 1.9.5 1.2.2-.6.2-1.8 0-2.5-.3-.6-.5-.1-.5 1.3zm41 0c0 1.4.2 1.9.5 1.2.2-.6.2-1.8 0-2.5-.3-.6-.5-.1-.5 1.3zM2 21c0 .6 3 1 7 1s7-.4 7-1-3-1-7-1-7 .4-7 1zm18 0a1.08 1.08 0 0 0 1 1c.6 0 1-.5 1-1a.94.94 0 0 0-1-1c-.5 0-1 .4-1 1zm6 0c0 .6 3 1 7 1s7-.4 7-1-3-1-7-1-7 .4-7 1zm-12 5.3c0 1 .8 1.7 1.8 1.7.9 0 1.3-.4.7-.8-.5-.4-1.3-1.1-1.7-1.6-.5-.5-.8-.2-.8.7zm12.2.2c-1.1 1.2-1 1.5.3 1.5a1.54 1.54 0 0 0 1.5-1.5c0-1.8-.2-1.8-1.8 0zM20 33c0 4 .4 7 1 7s1-3 1-7-.4-7-1-7-1 3-1 7zm-.2 8.7c.6.2 1.8.2 2.5 0 .6-.3.1-.5-1.3-.5s-1.9.2-1.2.5z"/></svg>';
    // tslint:disable-next-line:max-line-length
    markerPivot = '<svg width="15" height="15" viewBox="0 0 141 143" preserveAspectRatio="xMidYMid meet" fill="#495057"><path d="M55.5 3.6c-3.8.8-11.3 3.5-16.5 6.1-7.9 3.8-10.9 6-18.1 13.2C7 36.8.6 52.2.6 71.5c.1 11.6 1.9 19.8 6.8 30C19.3 126.6 42.5 141 70.9 141c32.3 0 59.1-20.6 67.7-52 2.4-8.8 2.4-25.2 0-34.5-5.2-20.1-21.9-39.5-40.5-47C85.2 2.2 69.2.8 55.5 3.6zm30 7.9c6.9 1.8 18.6 7.4 23 11l3 2.5-16.9 16.9c-14 14-17.3 16.8-18.7 16-5.2-2.7-15 .6-18.4 6.3-2 3.4-2.3 11.4-.6 14.6.6 1.2 2.7 3.3 4.6 4.8 6.6 5 17.1 3.1 21.4-3.9 2.2-3.6 2.8-10.5 1.2-13.6-.8-1.4 2-4.7 16-18.7L117 30.5l2.5 3c3.7 4.5 9.1 15.3 11.1 22 2.7 9.1 2.4 24-.5 33.5-11.5 37.4-52.6 55.2-87.5 38.1C1.7 107-4.1 51.9 31.8 23.1c5.9-4.8 15.4-9.5 23.2-11.7 6.4-1.8 23.4-1.7 30.5.1zm-12 49.1c1.4.6 1.1 1.3-1.9 4.3L68 68.6l2.8 2.7 2.8 2.7 3.4-3.5c3.6-3.7 5-3.3 5 1.3 0 6-5.6 11.2-12.2 11.2-8.2 0-13.7-10.3-9.1-17 3.1-4.5 8.8-6.9 12.8-5.4z"/></svg>';
    pivotsExtent: any = null;
    pointBounds: any = null;
    map: Map = null;
    showTimeSeries: boolean;
    pointTimeSeries: TimeSeries;
    pointInfo: PointInfo;
    pointInfoClicked: PointInfo;
    carPointInfo: Car[];
    showCarInfo: boolean;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private campaignService: CampaignService,
        private classService: ClassService,
        private harvestService: HarvestService,
        private inpectionsService: InspectionService,
        private storage: LocalStorageService,
    ) {
        this.campaign = this.clearCampaign();
        this.loadingPoints = false;
        this.showTimeSeries = false;
        this.campaignInspectionDialog = false;
        this.showCarInfo = false;
        this.mapPoints = [];
        this.mosaicsLayers = [];
        this.points = [];
        this.inspections = [];
        this.currentPoint = 2;
        this.startDate = null;
        this.endDate = null;
        this.pointInfo = null;
        this.pointInfoClicked = null;
        this.carPointInfo = [];
    }

    ngOnInit() {
        this.cols = [
            {field: 'name', header: 'Nome'},
            {field: 'description', header: 'Descrição'}
        ];
        this.colsTablePoints = [
            {field: 'lat', header: 'Latitude'},
            {field: 'lon', header: 'Longitude'},
            {field: 'description', header: 'Descrição'}
        ];
        const token = this.storage.retrieve('token');
        const jwtToken = jwtDecode(token);
        // @ts-ignore
        this.user = {id: jwtToken.id, email: jwtToken.email, password: ''};
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
        this.pointTimeSeries = {
            lon: null,
            lat: null,
            startDate: null,
            endDate: null
        };
        this.getClasses();
        this.getHarversts();
        this.getCampaigns();
    }

    changeMosaic(evt) {
        const pointLayer: Marker = marker([
            parseFloat(this.campaign.points[this.currentPoint].lat),
            parseFloat(this.campaign.points[this.currentPoint].lon)], {
            icon: divIcon(
                {
                    html: this.markerPoint,
                    iconSize: [60, 60]
                }
            )
        });
        this.pointBounds = latLng(
            parseFloat(this.campaign.points[this.currentPoint].lat),
            parseFloat(this.campaign.points[this.currentPoint].lon)
        ).toBounds(1000);
        this.mosaicsLayers = [];
        this.mosaicsLayers.push(pointLayer);
        this.mosaicsLayers.push(tileLayer(evt.value, {maxZoom: 18, attribution: 'TVI4Agriculture | NICFI - Norway\'s International Climate and Forests Initiative Satellite Data Program'}));
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
           this.mosaicsLayers.push(tileLayer(this.planetMosaics[0]._links.tiles, {maxZoom: 18, attribution: 'NICFI - Norway\'s International Climate and Forests Initiative Satellite Data Program'}));
        });
    }

    getPointInfo() {
        this.campaignService.pointInfo(
            this.parse(this.campaign.points[this.currentPoint].lon),
            this.parse(this.campaign.points[this.currentPoint].lat)).subscribe((pointInfo: PointInfo) => {
                this.pointInfo = pointInfo[0];
        });
    }

    getCarInfo() {
        this.campaignService.carInfo(
            this.parse(this.campaign.points[this.currentPoint].lon),
            this.parse(this.campaign.points[this.currentPoint].lat)).subscribe((result) => {
            this.carPointInfo = result;
            if (this.carPointInfo.length > 0) {
                this.carPointInfo = this.carPointInfo.map(car => {
                    car.data_ref = moment(car.data_ref).format('DD/MM/YYYY');
                    return car;
                });
            }
        });
    }
    getPointInfoClicked(lon, lat) {
        this.pointInfoClicked = null;
        this.campaignService.pointInfo(lon, lat).subscribe((pointInfo: PointInfo) => {
            this.pointInfoClicked = pointInfo[0];
        });
    }

    clearCampaign(): Campaign {
        this.points = [];
        return {
            name: null,
            description: null,
            classesType: null,
            classes: [],
            points: [],
            harvests: [],
            userId: null
        };
    }

    openNew() {
        this.campaign = this.clearCampaign();
        this.submitted = false;
        this.campaignDialog = true;
    }

    getClasses() {
        this.classService.all().subscribe(result => {
            this.classes = result.data.classes;
        }, error => {
            this.messageService.add({severity: 'error', summary: 'Busca das Classes', detail: error, life: 3000});
        });
    }
    getHarversts() {
        this.harvestService.all().subscribe(result => {
            this.harvests = result.data.harvests;
        }, error => {
            this.messageService.add({severity: 'error', summary: 'Busca das Safras', detail: error, life: 3000});
        });
    }
    getCampaigns() {
        this.campaignService.allByUser(this.user.id).subscribe(result => {
            this.campaigns = result.data.campaigns;
        }, error => {
            this.messageService.add({severity: 'error', summary: 'Busca das Campanhas', detail: error, life: 3000});
        });
    }

    setClass(evt, haverst) {
        if (this.inspections.length > 0) {
            const existOnInspections: Inspection = this.inspections.find(insp => insp.harvest.id === haverst.id);
            if (existOnInspections){
                this.inspections = this.inspections.filter(insp => insp.harvest.id !== haverst.id );
            }
        }
        this.inspections.push({
            user:  this.user,
            harvest: haverst,
            point: this.campaign.points[this.currentPoint],
            class: { id: evt.value },
            campaign: this.campaign
        });
    }

    deleteSelectedCampaigns() {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja remover as ' + this.selectedCampaigns.length + ' campanhas selecionadas?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle warn',
            acceptLabel: 'OK',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.campaignService.deleteMany(this.selectedCampaigns).subscribe(result => {
                    this.getCampaigns();
                    this.selectedCampaigns = null;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Campanhas removidas',
                        life: 3000
                    });
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Remoção em Lote', detail: error, life: 3000});
                });
            }
        });
    }

    editCampaign(campaign: Campaign) {
        this.campaign = {...campaign};
        this.mapPoints = campaign.points.map(point => {
            return marker([parseFloat(point.lat), parseFloat(point.lon)], {
                icon: divIcon(
                    {
                        html: this.markerPivot,
                        iconSize: [15, 15]
                    }
                )
            });
        });
        this.points = campaign.points;
        this.selectedTypeClass = this.typesClass.find((typ) => typ.value === campaign.classesType);
        this.campaignDialog = true;
    }

    deleteCampaign(campaign: Campaign) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja remover o registro da campanha ' + campaign.name + '?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle warn',
            acceptLabel: 'OK',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.campaignService.delete(campaign.id).subscribe(result => {
                    this.getCampaigns();
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Campanha ' + campaign.name + ' removida',
                            life: 3000
                        }
                    );
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Remoção', detail: error, life: 3000});
                });
            }
        });
    }

    hideDialog() {
        this.campaignDialog = false;
        this.submitted = false;
    }

    saveCamapaign() {
        this.submitted = true;
        this.campaign.classesType = this.selectedTypeClass.value;
        this.campaign.userId = this.user.id;
        this.campaign.user = this.user;
        this.campaign.points = this.points;
        // tslint:disable-next-line:max-line-length
        if (this.campaign.name && this.campaign.points.length > 0 && this.campaign.classes.length > 0 && this.campaign.harvests.length > 0) {
            if (this.campaign.id) {
                this.campaignService.update(this.campaign).subscribe(result => {
                    this.getCampaigns();
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Campanha ' + result.data.campaignUpdated[0].name + ' atualizada.',
                            life: 3000
                        }
                    );
                }, error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Atualização da Campanha',
                        detail: error,
                        life: 3000
                    });
                });
            } else {
                this.campaignService.create(this.campaign).subscribe(result => {
                    this.getCampaigns();
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Campanha ' + result.data.campaign.name + ' criada',
                            life: 3000
                        }
                    );
                }, error => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Criação da campanha',
                        detail: error,
                        life: 3000
                    });
                });
            }
            this.campaignDialog = false;
            this.campaign = this.clearCampaign();
        } else {
            this.messageService.add(
                {
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Você precisa preencher os campos obrigtórios',
                    life: 3000
                }
            );
        }
    }

    inspectCampaign(camp: Campaign) {
        this.inepectionMode = 'edit';
        this.currentPoint = 0;
        this.campaign = null;
        this.pointInfo = null;
        this.pointInfoClicked = null;
        this.campaign = {...camp};
        this.inpectionsService.getLastInspection(this.campaign.id).subscribe((result) => {
            if (result.data){
                const lastInspentectionPoint = this.campaign.points.findIndex(point => {
                    return point.id === result.data.inspection.point.id;
                });
                this.currentPoint = lastInspentectionPoint + 1;
                this.campaignInspectionDialog = true;
            } else {
                this.currentPoint = 0;
            }
            this.loadPoint();
            this.loadMosaics();
            this.getPointInfo();
            this.getCarInfo();
        }, error => {
            this.messageService.add(
                {
                    key: 'inspection',
                    severity: 'error',
                    summary: 'Erro ao buscar o último ponto inspecionado',
                    detail: error,
                    life: 3000
                }
            );
            this.campaignInspectionDialog = false;
        });
    }
    loadMosaics(){
        const startDates = this.campaign.harvests.map((harvest) => harvest.start);
        const endDates = this.campaign.harvests.map((harvest) => harvest.end);
        const min = startDates.reduce((acc, date ) => acc && new Date(acc) < new Date(date) ? acc : date, '');
        const max = endDates.reduce((acc, date ) => acc && new Date(acc) > new Date(date) ? acc : date, '');
        this.startDate = moment(min).format('YYYY-MM-DD');
        this.endDate = moment(max).format('YYYY-MM-DD');
        this.getPlanetMosaics();
    }
    loadPoint(navigation = false){
        const pointLayer = marker([
            parseFloat(this.campaign.points[this.currentPoint].lat),
            parseFloat(this.campaign.points[this.currentPoint].lon)], {
            icon: divIcon(
                {
                    html: this.markerPoint,
                    iconSize: [60, 60]
                }
            )
        });
        this.mosaicsLayers = [];
        this.mosaicsLayers.push(pointLayer);
        this.optionsMoisaicMap.center = latLng(
            parseFloat(this.campaign.points[this.currentPoint].lat),
            parseFloat(this.campaign.points[this.currentPoint].lon)
        );
        this.pointBounds = latLng(
            parseFloat(this.campaign.points[this.currentPoint].lat),
            parseFloat(this.campaign.points[this.currentPoint].lon)
        ).toBounds(1000);
        if ( navigation ){
            this.mosaicsLayers.push(tileLayer(this.planetMosaics[0]._links.tiles, {maxZoom: 18, attribution: 'NICFI - Norway\'s International Climate and Forests Initiative Satellite Data Program'}));
        }
    }

    getTypeName(campaign: Campaign): string {
        return this.typesClass.find((typ) => typ.value === campaign.classesType).name;
    }

    findIndexById(id): number {
        let index = -1;
        for (let i = 0; i < this.campaigns.length; i++) {
            if (this.campaigns[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    displayFieldCss(field: string) {
        return {
            'ng-dirty': this.campaign[field] === '' && this.submitted,
            'ng-invalid': this.campaign[field] === '' && this.submitted
        };
    }

    onUploadPoints(evt) {
        const self = this;
        this.loadingPoints = true;
        this.points = [];
        this.mapPoints = [];
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
            self.points = self.csvToArray(fileReader.result);
            self.points = self.points.filter((item, i) => {
                return (item.lat !== null && item.lon !== null);
            });

            for (const [index, point] of self.points.entries()) {
                self.mapPoints.push(marker([
                    parseFloat(this.campaign.points[this.currentPoint].lat),
                    parseFloat(this.campaign.points[this.currentPoint].lon)], {
                    icon: divIcon(
                        {
                            html: this.markerPivot,
                            iconSize: [15, 15]
                        }
                    )
                }));
                self.points[index].description = point.description ? point.description : '';
            }
            self.loadingPoints = false;

        };
        fileReader.readAsText(evt.files[0]);
    }

    csvToArray(csvString) {
        const lines = csvString.split('\n');
        const headerValues = lines[0].split(',');
        const dataValues = lines.splice(1).map((dataLine) => {
            return dataLine.split(',');
        });
        return dataValues.map((rowValues) => {
            const row = {};
            headerValues.forEach((headerValue, index) => {
                row[headerValue] = (index < rowValues.length) ? rowValues[index] : null;
            });
            return row as Point;
        });
    }

    clearMap() {
        this.mapPoints = [];
    }
    resetPoint(currentPoint){
        this.campaign.harvests = this.campaign.harvests.map(harvest => {
            harvest.selected = 0;
            return harvest;
        });
        this.pointInfo = null;
        this.showCarInfo = false;
        this.currentPoint = currentPoint;
        this.loadPoint();
        this.getPointInfo();
        this.changeMosaic({value: this.planetMosaics[0]._links.tiles});
        this.inspections = [];
        this.carPointInfo = [];
        this.getCarInfo();
    }
    onSaveInpection(nextPoint) {
        this.inpectionsService.createMany(this.inspections).subscribe(result => {
            this.messageService.add(
                {
                    key: 'inspection',
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Classes inseridas com sucesso!',
                    life: 3000
                }
            );
            this.resetPoint(nextPoint);
        }, error => {
            this.messageService.add(
                {
                    key: 'inspection',
                    severity: 'error',
                    summary: 'Erro no cadastro classes',
                    detail: error,
                    life: 3000
                }
            );
        });
    }

    back() {
        const prevPoint = this.currentPoint - 1;
        if (prevPoint >= 0) {
            this.resetPoint(prevPoint);
        }
    }
    next() {
        const nextPoint = this.currentPoint + 1;
        if (nextPoint <= this.campaign.points.length - 1) {
            if (this.inspections.length === this.campaign.harvests.length){
                this.onSaveInpection(nextPoint);
            } else {
                this.messageService.add(
                    {
                        key: 'inspection',
                        severity: 'warn',
                        summary: 'Atenção',
                        detail: 'Você precisa definir todas as classes.',
                        life: 3000
                    }
                );
            }
        }
    }
    onClick(evt){
        this.pointTimeSeries = {
            lon: evt.latlng.lng,
            lat: evt.latlng.lat,
            startDate: this.startDate,
            endDate: this.endDate
        };
        this.getPointInfoClicked(evt.latlng.lng, evt.latlng.lat);
        this.showTimeSeries = true;
    }
    onMapReady(map: Map) {
        this.map = map;
    }
    parse(value: string): number {
        return parseFloat(value);
    }
    normalize(value): string {
        return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(' ', '_');
    }
    exportSHP(camp: Campaign){
        this.campaignService.downloadSHP(camp.id).toPromise()
            .then(blob => {
                saveAs(blob, this.normalize(camp.name) + '.zip');
            }).catch(error => {
            this.messageService.add({
                life: 2000,
                severity: 'error',
                summary: 'Erro ao baixar o arquivo SHP dos pontos inspecionados.',
                detail: error
            });
        });
    }
}
