import {Component, OnInit} from '@angular/core';
import {AppMainComponent} from '../app.main.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public app: AppMainComponent) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Home', icon: 'pi pi-home', routerLink: ['/']
            },
            {
                label: 'Campanhas', icon: 'pi pi-map', routerLink: ['/campaign']
            },
            {
                label: 'Classes', icon: 'pi pi-list', routerLink: ['/class']
            },
            {
                label: 'Safras', icon: 'pi pi-calendar', routerLink: ['/harvest']
            }
        ];
    }
}
