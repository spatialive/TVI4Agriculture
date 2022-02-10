import {Component, OnInit} from '@angular/core';
import {AppMainComponent} from './app.main.component';

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
                label: 'Dashboard', icon: 'pi pi-home',
                items: [
                    {label: 'Sales', icon: 'pi pi-desktop', routerLink: ['/']},
                    {label: 'Analytics', icon: 'pi pi-chart-bar', routerLink: ['/analytics']}
                ]
            },
            {
                label: 'UI Kit', icon: 'pi pi-star', routerLink: ['/uikit'],
                items: [
                    {label: 'Form Layout', icon: 'pi pi-id-card', routerLink: ['/uikit/formlayout']},
                    {label: 'Input', icon: 'pi pi-check-square', routerLink: ['/uikit/input']},
                    {label: 'Float Label', icon: 'pi pi-bookmark', routerLink: ['/uikit/floatlabel']},
                    {label: 'Invalid State', icon: 'pi pi-exclamation-circle', routerLink: ['/uikit/invalidstate']},
                    {label: 'Button', icon: 'pi pi-mobile', routerLink: ['/uikit/button'], class: 'rotated-icon'},
                    {label: 'Table', icon: 'pi pi-table', routerLink: ['/uikit/table']},
                    {label: 'List', icon: 'pi pi-list', routerLink: ['/uikit/list']},
                    {label: 'Tree', icon: 'pi pi-share-alt', routerLink: ['/uikit/tree']},
                    {label: 'Panel', icon: 'pi pi-tablet', routerLink: ['/uikit/panel']},
                    {label: 'Overlay', icon: 'pi pi-clone', routerLink: ['/uikit/overlay']},
                    {label: 'Media', icon: 'pi pi-image', routerLink: ['/uikit/media']},
                    {label: 'Menu', icon: 'pi pi-bars', routerLink: ['/uikit/menu']},
                    {label: 'Message', icon: 'pi pi-comment', routerLink: ['/uikit/message']},
                    {label: 'File', icon: 'pi pi-file', routerLink: ['/uikit/file']},
                    {label: 'Chart', icon: 'pi pi-chart-bar', routerLink: ['/uikit/charts']},
                    {label: 'Misc', icon: 'pi pi-circle-off', routerLink: ['/uikit/misc']}
                ]
            },
            {
                label: 'Utilities', icon: 'pi pi-compass', routerLink: ['utilities'],
                items: [
                    {label: 'Display', icon: 'pi pi-desktop', routerLink: ['utilities/display']},
                    {label: 'Elevation', icon: 'pi pi-external-link', routerLink: ['utilities/elevation']},
                    {label: 'FlexBox', icon: 'pi pi-directions', routerLink: ['utilities/flexbox']},
                    {label: 'Icons', icon: 'pi pi-search', routerLink: ['utilities/icons']},
                    {label: 'Text', icon: 'pi pi-pencil', routerLink: ['utilities/text']},
                    {label: 'Widgets', icon: 'pi pi-star', routerLink: ['utilities/widgets']},
                    {label: 'Grid System', icon: 'pi pi-th-large', routerLink: ['utilities/grid']},
                    {label: 'Spacing', icon: 'pi pi-arrow-right', routerLink: ['utilities/spacing']},
                    {label: 'Typography', icon: 'pi pi-align-center', routerLink: ['utilities/typography']}
                ]
            },
            {
                label: 'Pages', icon: 'pi pi-briefcase', routerLink: ['/pages'],
                items: [
                    {label: 'Crud', icon: 'pi pi-pencil', routerLink: ['/pages/crud']},
                    {label: 'Calendar', icon: 'pi pi-calendar-plus', routerLink: ['/pages/calendar']},
                    {label: 'Timeline', icon: 'pi pi-calendar', routerLink: ['/pages/timeline']},
                    {label: 'Landing', icon: 'pi pi-globe', url: 'assets/pages/landing.html', target: '_blank'},
                    {label: 'Login', icon: 'pi pi-sign-in', routerLink: ['/login']},
                    {label: 'Invoice', icon: 'pi pi-dollar', routerLink: ['/pages/invoice']},
                    {label: 'Help', icon: 'pi pi-question-circle', routerLink: ['/pages/help']},
                    {label: 'Error', icon: 'pi pi-times-circle', routerLink: ['/error']},
                    {label: 'Not Found', icon: 'pi pi-exclamation-circle', routerLink: ['/notfound']},
                    {label: 'Access Denied', icon: 'pi pi-lock', routerLink: ['/access']},
                    {label: 'Empty', icon: 'pi pi-circle-off', routerLink: ['/pages/empty']}
                ]
            },
            {
                label: 'Hierarchy', icon: 'pi pi-align-left',
                items: [
                    {
                        label: 'Submenu 1', icon: 'pi pi-align-left',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'pi pi-align-left',
                                items: [
                                    {label: 'Submenu 1.1.1', icon: 'pi pi-align-left'},
                                    {label: 'Submenu 1.1.2', icon: 'pi pi-align-left'},
                                    {label: 'Submenu 1.1.3', icon: 'pi pi-align-left'},
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'pi pi-align-left',
                                items: [
                                    {label: 'Submenu 1.2.1', icon: 'pi pi-align-left'}
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'pi pi-align-left',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'pi pi-align-left',
                                items: [
                                    {label: 'Submenu 2.1.1', icon: 'pi pi-align-left'},
                                    {label: 'Submenu 2.1.2', icon: 'pi pi-align-left'},
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'pi pi-align-left',
                                items: [
                                    {label: 'Submenu 2.2.1', icon: 'pi pi-align-left'},
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Start', icon: 'pi pi-download',
                items: [
                    {
                        label: 'Buy Now', icon: 'pi pi-shopping-cart', url: ['https://www.primefaces.org/store']
                    },
                    {
                        label: 'Documentation', icon: 'pi pi-info-circle', routerLink: ['/documentation']
                    }
                ]
            }
        ];
    }
}
