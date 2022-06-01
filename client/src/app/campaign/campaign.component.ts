import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Class} from '../@core/interfaces/class.interface';
import {Icon, icon, latLng, Marker, marker, tileLayer} from 'leaflet';
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
import {SafePipe} from "../pipes/safe";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    templateUrl: './campaign.component.html',
    styleUrls: ['../demo/view/tabledemo.scss', 'campaign.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class CampaignComponent implements OnInit {
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
    options = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'TVI4Agriculture'
            })
        ],
        zoom: 3,
        minZoom: 4,
        maxZoom: 16,
        center: latLng(-14.235004, -51.92528)
    };
    optionsMoisaicMap = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'TVI4Agriculture'
            })
        ],
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
    private safePipe: SafePipe = new SafePipe(this.domSanitizer);

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private campaignService: CampaignService,
        private classService: ClassService,
        private harvestService: HarvestService,
        private inpectionsService: InspectionService,
        private storage: LocalStorageService,
        private domSanitizer: DomSanitizer
    ) {
        this.campaign = this.clearCampaign();
        this.loadingPoints = false;
        this.campaignInspectionDialog = false;
        this.mapPoints = [];
        this.mosaicsLayers = [];
        this.points = [];
        this.inspections = [];
        this.currentPoint = 0;
    }

    ngOnInit() {
        this.getClasses();
        this.getHarversts();
        this.getCampaigns();
        this.getPlanetMosaics();
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
    }

    changeMosaic(evt) {
        const pointLayer = marker([
            parseFloat(this.campaign.points[this.currentPoint].lat),
            parseFloat(this.campaign.points[this.currentPoint].lon)], {
            icon: icon({
                ...Icon.Default.prototype.options,
                iconUrl: 'assets/leaflet/marker.png',
                iconRetinaUrl: 'assets/leaflet/marker.png',
                shadowUrl: 'assets/marker-shadow.png',
                className: 'dummy'
            })
        });
        this.mosaicsLayers = [];
        this.mosaicsLayers.push(pointLayer);
        this.mosaicsLayers.push(tileLayer(evt.value, {maxZoom: 18, attribution: 'TVI4Agriculture'}));
    }

    getPlanetMosaics() {
        this.campaignService.mosaics().subscribe(mosaics => {
            this.planetMosaics = mosaics;
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
        this.campaignService.all().subscribe(result => {
            this.campaigns = result.data.campaigns;
        }, error => {
            this.messageService.add({severity: 'error', summary: 'Busca das Campanhas', detail: error, life: 3000});
        });
    }

    setClass(evt, haverst) {
        this.inspections.push({
            userId: this.user.id,
            harvestId: haverst.id,
            pointId: this.campaign.points[this.currentPoint].id,
            classId: evt.value
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
                icon: icon({
                    ...Icon.Default.prototype.options,
                    iconUrl: 'assets/marker-icon.png',
                    iconRetinaUrl: 'assets/marker-icon-2x.png',
                    shadowUrl: 'assets/marker-shadow.png'
                })
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
                            detail: 'Campanha ' + result.data.campaignUpdated.name + ' atualizada.',
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
                            detail: 'Campanha ' + result.data.classe.name + ' criada',
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
        this.campaignInspectionDialog = true;
        this.campaign = {...camp};
        const pointLayer = marker([
            parseFloat(this.campaign.points[this.currentPoint].lat),
            parseFloat(this.campaign.points[this.currentPoint].lon)], {
            icon: icon({
                ...Icon.Default.prototype.options,
                iconUrl: 'assets/leaflet/marker.png',
                iconRetinaUrl: 'assets/leaflet/marker.png',
                shadowUrl: 'assets/marker-shadow.png',
                className: 'dummy'
            })
        });
        this.mosaicsLayers = [];
        this.mosaicsLayers.push(pointLayer);
        this.optionsMoisaicMap.center = latLng(
            parseFloat(this.campaign.points[this.currentPoint].lat),
            parseFloat(this.campaign.points[this.currentPoint].lon)
        );
        this.getTimeSeries();
        this.mosaicsLayers.push(tileLayer(this.planetMosaics[0]._links.tiles, {maxZoom: 18, attribution: this.planetMosaics[0].name}));
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
                self.mapPoints.push(marker([parseFloat(point.lat), parseFloat(point.lon)], {
                    icon: icon({
                        ...Icon.Default.prototype.options,
                        iconUrl: 'assets/marker-icon.png',
                        iconRetinaUrl: 'assets/marker-icon-2x.png',
                        shadowUrl: 'assets/marker-shadow.png'
                    })
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

    onSaveInpection() {
    }

    back() {
        if (this.currentPoint !== 0) {
            this.currentPoint = this.currentPoint - 1;
        }
    }

    getTimeSeries(){
        this.campaignService.timeseries(parseFloat(this.campaign.points[this.currentPoint].lon), parseFloat(this.campaign.points[this.currentPoint].lat), '2016-01-01', '2021-12-31').subscribe((result: any) => {
            this.timeSeriesData = {
                labels: result?.dates,
                datasets: [
                    {
                        label: 'EVI Suavizado',
                        data: result.evi_wtk_smooth_series,
                        fill: false,
                        tension: .4,
                        borderColor: '#42A5F5'
                    },
                    {
                        label: 'EVI Original',
                        data: result.evi_raw_series,
                        fill: false,
                        tension: .4,
                        borderColor: '#66BB6A'
                    }
                ]
            };
        });
    }
}
