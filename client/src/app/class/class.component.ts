import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Class} from '../@core/interfaces/class.interface';
import {ClassService} from '../services/class.service';

@Component({
    templateUrl: './class.component.html',
    styleUrls: ['../demo/view/tabledemo.scss', 'class.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class ClassComponent implements OnInit {
    classe: Class;
    classes: Class[];
    classeDialog: boolean;
    selectedClasses: Class[];
    submitted: boolean;
    cols: any[];
    selectedType: any = {name: 'Dinâmicas', value: 'DYNAMIC'};
    types: any[] = [
        {name: 'Dinâmicas', value: 'DYNAMIC'},
        {name: 'Áreas Irrigadas e Não Irrigadas', value: 'IRRIGATED_NON_IRRIGATED'}
    ];
    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private classService: ClassService,
    ) {
        this.classe = this.clearClass();
    }
    ngOnInit() {
        this.getClasses();
        this.cols = [
            {field: 'name', header: 'Nome'},
            {field: 'description', header: 'Descrição'},
            {field: 'type', header: 'Tipo'}
        ];
    }
    clearClass(): Class {
        return {
            name: null,
            description: null,
            type: null
        };
    }

    openNew() {
        this.classe = this.clearClass();
        this.submitted = false;
        this.classeDialog = true;
    }

    getClasses(){
        this.classService.all().subscribe(result => {
            this.classes = result.data.classes;
        }, error => {
            this.messageService.add({severity: 'error', summary: 'Busca das Classes', detail: error, life: 3000});
        });
    }

    deleteSelectedClasses() {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja remover as ' + this.selectedClasses.length + ' classes selecionadas?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle warn',
            acceptLabel: 'OK',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.classService.deleteMany(this.selectedClasses).subscribe(result => {
                    this.getClasses();
                    this.selectedClasses = null;
                    this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Classes removidas', life: 3000});
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Remoção em Lote', detail: error, life: 3000});
                });
            }
        });
    }

    editClass(classe: Class) {
        this.classe = {...classe};
        this.selectedType = this.types.find((typ) => typ.value === classe.type);
        this.classeDialog = true;
    }

    deleteClass(classe: Class) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja remover o registro da classe ' + classe.name + '?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle warn',
            acceptLabel: 'OK',
            rejectLabel: 'Cancelar',
            rejectButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.classService.delete(classe.id).subscribe(result => {
                    this.getClasses();
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Classe ' + classe.name + ' removida',
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
        this.classeDialog = false;
        this.submitted = false;
    }

    saveClass() {
        this.submitted = true;
        this.classe.type = this.selectedType.value;
        if (this.classe.name && this.classe.type) {
            if (this.classe.id) {
                this.classService.update(this.classe).subscribe(result => {
                    this.getClasses();
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Classe ' + result.data.classUpdated.name + ' atualizada.',
                            life: 3000
                        }
                    );
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Atualização da classe', detail: error, life: 3000});
                });
            } else {
                this.classService.create(this.classe).subscribe(result => {
                    this.getClasses();
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Classe ' + result.data.classe.name + ' criada',
                            life: 3000
                        }
                    );
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Criação da classe', detail: error, life: 3000});
                });
            }
            this.classeDialog = false;
            this.classe = this.clearClass();
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

    getTypeName(classe: Class): string{
        return  this.types.find((typ) => typ.value === classe.type).name;
    }

    findIndexById(id): number {
        let index = -1;
        for (let i = 0; i < this.classes.length; i++) {
            if (this.classes[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    displayFieldCss(field: string) {
        return {
            'ng-dirty': this.classe[field] === '' && this.submitted,
            'ng-invalid': this.classe[field] === '' && this.submitted
        };
    }
}
