import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Harvest} from '../@core/interfaces/harvest.interface' ;
import {HarvestService} from '../services/harvest.service';

@Component({
    templateUrl: './harvest.index.component.html',
    styleUrls: ['../demo/view/tabledemo.scss', 'harvest.index.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class HarvestIndexComponent implements OnInit {
    harvest: Harvest;
    harvests: Harvest[];
    harvestDialog: boolean;
    selectedHarvests: Harvest[];
    submitted: boolean;
    cols: any[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private harvestService: HarvestService,
    ) {
        this.harvest = this.clearHarvest();
    }
    ngOnInit() {
        this.getHarvests();
        this.cols = [
            {field: 'name', header: 'Nome'},
            {field: 'start', header: 'Início'},
            {field: 'end', header: 'Fim'},
            {field: 'startWet', header: 'Início Período Chuvoso'},
            {field: 'endWet', header: 'Fim Período Chuvoso'},
            {field: 'startDry', header: 'Início Periodo Seco'},
            {field: 'endDry', header: 'Fim Periodo Seco'},
            {field: 'createdAt', header: 'Criado em'},
            {field: 'updatedAt', header: 'Atualizado em'}
        ];
    }
    clearHarvest(): Harvest {
        return {
            name: null,
            start: null,
            end: null,
            startDry: null,
            endDry: null,
            startWet: null,
            endWet: null,
        };
    }

    openNew() {
        this.harvest = this.clearHarvest();
        this.submitted = false;
        this.harvestDialog = true;
    }

    getHarvests(){
        this.harvestService.all().subscribe(result => {
            this.harvests = result.data.harvests;
        }, error => {
            this.messageService.add({severity: 'error', summary: 'Busca das Safras', detail: error, life: 3000});
        });
    }

    deleteSelectedHarvests() {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja remover as ' + this.selectedHarvests.length + ' safras selecionadas?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle warn',
            acceptLabel: 'OK',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.harvestService.deleteMany(this.selectedHarvests).subscribe(result => {
                    this.getHarvests();
                    this.selectedHarvests = null;
                    this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Safras removidas', life: 3000});
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Remoção em Lote', detail: error, life: 3000});
                });
            }
        });
    }

    editHarvest(harvest: Harvest) {
        this.harvest = {...harvest};
        this.harvest.start = new Date(this.harvest.start);
        this.harvest.end = new Date(this.harvest.end);
        this.harvest.startWet = new Date(this.harvest.startWet);
        this.harvest.endWet = new Date(this.harvest.endWet);
        this.harvest.startDry = new Date(this.harvest.startDry);
        this.harvest.endDry = new Date(this.harvest.endDry);
        this.harvestDialog = true;
    }

    deleteHarvest(harvest: Harvest) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja remover o registro da ' + harvest.name + '?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle warn',
            acceptLabel: 'OK',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.harvestService.delete(harvest.id).subscribe(result => {
                    this.getHarvests();
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Safra ' + harvest.name + ' removida',
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
        this.harvestDialog = false;
        this.submitted = false;
    }

    saveHarvest() {
        this.submitted = true;

        if (this.harvest.name && this.harvest.start && this.harvest.end) {
            if (this.harvest.id) {
                this.harvestService.update(this.harvest).subscribe(result => {
                    this.getHarvests();
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: result.data.updateHarvest.name + ' atualizada.',
                            life: 3000
                        }
                    );
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Atualização da Safra', detail: error, life: 3000});
                });
            } else {
                this.harvestService.create(this.harvest).subscribe(result => {
                    this.getHarvests();
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: result.data.harvest.name + ' criada',
                            life: 3000
                        }
                    );
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Criação da Safra', detail: error, life: 3000});
                });
            }
            this.harvestDialog = false;
            this.harvest = this.clearHarvest();
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

    findIndexById(id): number {
        let index = -1;
        for (let i = 0; i < this.harvests.length; i++) {
            if (this.harvests[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    displayFieldCss(field: string) {
        return {
            'ng-dirty': this.harvest[field] === '' && this.submitted,
            'ng-invalid': this.harvest[field] === '' && this.submitted
        };
    }
}
