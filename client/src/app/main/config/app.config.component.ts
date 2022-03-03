import {Component, OnInit} from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppMainComponent } from '../app.main.component';

@Component({
    selector: 'app-config',
    template: `
        <a style="cursor: pointer" id="layout-config-button" class="layout-config-button" (click)="onConfigButtonClick($event)">
            <i class="pi pi-cog"></i>
        </a>
        <div class="layout-config" [ngClass]="{'layout-config-active': appMain.configActive}" (click)="appMain.onConfigClick($event)">
            <h5>Menu Type</h5>
            <div class="field-radiobutton">
                <p-radioButton name="menuMode" value="static" [(ngModel)]="app.menuMode" inputId="mode1"></p-radioButton>
                <label for="mode1">Static</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="menuMode" value="slim" [(ngModel)]="app.menuMode" inputId="mode2"></p-radioButton>
                <label for="mode2">Slim</label>
            </div>

            <h5>Layout</h5>
            <div class="field-radiobutton">
                <p-radioButton name="colorScheme" value="light" [(ngModel)]="app.colorScheme" inputId="scheme1" (onClick)="changeColorScheme('light')"></p-radioButton>
                <label for="scheme1">Light</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="colorScheme" value="dark" [(ngModel)]="app.colorScheme" inputId="scheme2" (onClick)="changeColorScheme('dark')"></p-radioButton>
                <label for="scheme2">Dark</label>
            </div>

            <h5>Layout Colors</h5>
            <div class="layout-themes" *ngIf="app.colorScheme === 'light'">
                <div *ngFor="let l of layoutColor">
                    <a style="cursor: pointer" (click)="changeLayoutColor(l.name)" [ngStyle]="{'background': l.color}">
                        <i class="pi pi-check" *ngIf="app.layoutColor === l.name"></i>
                    </a>
                </div>
            </div>
            <div *ngIf="app.colorScheme !== 'light'">
                <p>Layout themes are only available in light mode by design as large surfaces can emit too much brightness in dark mode.</p>
            </div>

            <h5>Input Style</h5>
            <div class="field-radiobutton">
                <p-radioButton name="inputStyle" value="outlined" [(ngModel)]="app.inputStyle" inputId="inputStyle1"></p-radioButton>
                <label for="inputStyle1">Outlined</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="inputStyle" value="filled" [(ngModel)]="app.inputStyle" inputId="inputStyle2"></p-radioButton>
                <label for="inputStyle2">Filled</label>
            </div>

            <h5>Ripple Effect</h5>
			<p-inputSwitch [ngModel]="app.ripple" (onChange)="appMain.onRippleChange($event)"></p-inputSwitch>

            <h5>Themes</h5>
            <div class="layout-themes">
                <div *ngFor="let t of themes">
                    <a style="cursor: pointer" (click)="changeTheme(t.name)" [ngStyle]="{'background-color': app.colorScheme === 'light' ? t.color1 :t.color2}">
                        <i class="pi pi-check" *ngIf="app.theme === t.name"></i>
                    </a>
                </div>
            </div>
        </div>
    `
})
export class AppConfigComponent implements OnInit {

    layoutColor: any[];

    themes: any[];

    tempLayoutColor = 'white';

    constructor(public appMain: AppMainComponent, public app: AppComponent) {}

    ngOnInit() {
        this.layoutColor = [
            {name: 'white', color: '#ffffff'},
            {name: 'blue', color: 'linear-gradient(147.38deg, #4C96B6 0%, #19496C 100%)'},
            {name: 'cyan', color: 'linear-gradient(147.38deg, #4CB6A3 0%, #19536C 100%)'},
            {name: 'deepblue', color: 'linear-gradient(147.38deg, #4C63B6 0%, #19216C 100%)'},
            {name: 'purple', color: 'linear-gradient(147.38deg, #9E768F 0%, #656C98 100%)'},
            {name: 'yellow', color: 'linear-gradient(147.38deg, #C57F6A 0%, #DABE67 100%)'},
            {name: 'deeppurple', color: 'linear-gradient(147.38deg, #684789 0%, #647DEE 100%)'},
            {name: 'orange', color: 'linear-gradient(147.38deg, #BD9279 0%, #BE5757 100%)'},
            {name: 'green', color: 'linear-gradient(147.38deg, #45947A 0%, #A6BF5D 100%)'},
            {name: 'mauve', color: 'linear-gradient(147.38deg, #455B94 0%, #BFAA5D 100%)'},
            {name: 'dusk', color: 'linear-gradient(147.38deg, #7B3F81 0%, #5DB3BF 100%)'},
            {name: 'ocean', color: 'linear-gradient(147.38deg, #455B94 0%, #90B967 100%)'},
            {name: 'deepgreen', color: 'linear-gradient(147.38deg, #767C50 0%, #344B6F 100%)'},
        ];

        this.themes = [
            {name: 'indigo', color1: '#4C63B6', color2 : '#6A7EC2'},
            {name: 'blue', color1: '#1992D4', color2 : '#3BABE8'},
            {name: 'green', color1: '#27AB83', color2 : '#44D4A9'},
            {name: 'deeppurple', color1: '#896FF4', color2 : '#B1A0F8'},
            {name: 'orange', color1: '#DE911D', color2 : '#E8AB4F'},
            {name: 'cyan', color1: '#00B9C6', color2 : '#58CDD5'},
            {name: 'yellow', color1: '#F9C404', color2 : '#FDDD68'},
            {name: 'pink', color1: '#C74B95', color2 : '#D77FB4'},
            {name: 'purple', color1: '#BA6FF4', color2 : '#D1A0F8'},
            {name: 'lime', color1: '#84BD20', color2 : '#A3D44E'},
        ];
    }

    changeTheme(theme) {
        this.app.theme = theme;
        const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
        const href = 'assets/theme/' + theme + '/theme-' + this.app.colorScheme + '.css';

        this.replaceLink(themeLink, href);
    }

    changeColorScheme(scheme) {
        this.app.colorScheme = scheme;
        this.app.layoutColor = scheme === 'dark' ? scheme : this.tempLayoutColor;

        const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
        const layoutHref = 'assets/layout/css/layout-' + (scheme === 'dark' ? scheme : this.tempLayoutColor) + '.css';
        this.replaceLink(layoutLink, layoutHref);

        const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
        const themeHref = 'assets/theme/' + this.app.theme + '/theme-' + scheme + '.css';
        this.replaceLink(themeLink, themeHref, this.appMain['refreshChart']);
    }


    changeLayoutColor(name) {
        this.tempLayoutColor = name;
        this.app.layoutColor = name;

        const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
        const layoutHref = 'assets/layout/css/layout-' + name + '.css';
        this.replaceLink(layoutLink, layoutHref);
    }

    isIE() {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    }

    replaceLink(linkElement, href, callback?) {
        if (this.isIE()) {
            linkElement.setAttribute('href', href);

            if (callback) {
                callback();
            }
        } else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);

                if (callback) {
                    callback();
                }
            });
        }
    }

    onConfigButtonClick(event) {
        this.appMain.configActive = !this.appMain.configActive;
        this.appMain.configClick = true;
        event.preventDefault();
    }
}
