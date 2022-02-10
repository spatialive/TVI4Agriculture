import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    menu: any[];

    @ViewChild('input1') inputElement1: ElementRef;

    @ViewChild('input2') inputElement2: ElementRef;

    constructor(public app: AppComponent, public appMain: AppMainComponent) {
    }

    ngOnInit() {
        this.menu = [{
            label: 'Menu',
            items: [
                {
                    label: 'UI Kit', icon: 'pi pi-align-left',
                    items: [
                        {label: 'Form Layout', icon: 'pi pi-id-card', routerLink: ['/uikit/formlayout']},
                        {label: 'Input', icon: 'pi pi-check-square', routerLink: ['/uikit/input']},
                    ]
                },
                {
                    label: 'Hierarchy', icon: 'pi pi-align-left',
                    items: [
                        {
                            label: 'Submenu 1', icon: 'pi pi-align-left',
                            items: [
                                {label: 'Submenu 1.1', icon: 'pi pi-align-left'},
                                {label: 'Submenu 1.2', icon: 'pi pi-align-left'},
                            ]
                        },
                        {
                            label: 'Submenu 2', icon: 'pi pi-align-left',
                            items: [
                                {label: 'Submenu 2.1', icon: 'pi pi-align-left'},
                            ]
                        },
                    ]
                }
            ]
        }
        ];
    }

    searchFocus(event) {
        if (this.appMain.search) {
            setTimeout(() => {
                this.inputElement1.nativeElement.focus();
                this.inputElement2.nativeElement.focus();
            }, 100);
        }
    }
}
