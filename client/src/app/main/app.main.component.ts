import {Component, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { MenuService } from './menu/app.menu.service';
import { TopbarMenuService } from './topbar/topbarmenu/app.topbarmenu.service';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import { AppComponent } from '../app.component';
import jwtDecode from 'jwt-decode';
import {User} from '../interfaces/user.interface';
import {LocalStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html'
})
export class AppMainComponent implements AfterViewInit{

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    menuClick: boolean;

    topbarItemClick: boolean;

    menuHoverActive = false;

    topbarMenuActive = false;

    activeTopbarItem: Element;

    searchClick = false;

    search = false;

    configActive: boolean;

    configClick: boolean;

    topbarMenuClick = false;

    user: User;

    constructor(
        private menuService: MenuService,
        private topbarmenuService: TopbarMenuService,
        private primengConfig: PrimeNGConfig,
        public app: AppComponent,
        private router: Router,
        private storage: LocalStorageService,
        private service: MessageService,
        private cdref: ChangeDetectorRef
    ) { }
    ngAfterViewInit(): void {
        const token = this.storage.retrieve('token');
        if (token){
            this.user = jwtDecode(token);
            this.cdref.detectChanges();
        }
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (this.configActive && !this.configClick) {
            this.configActive = false;
        }

        if (!this.menuClick) {
            if (this.isSlim()) {
                this.menuService.reset();
            }

            this.menuHoverActive = false;
            this.staticMenuMobileActive = false;
        }

        if (this.topbarMenuClick) {
            if (this.isSlim()) {
                this.menuHoverActive = false;
            }
        }
        if (!this.topbarMenuClick) {
            this.topbarmenuService.reset();
        }

        if (!this.searchClick) {
            this.search = false;
        }

        this.searchClick = false;
        this.configClick = false;
        this.menuClick = false;
        this.topbarItemClick = false;
        this.topbarMenuClick = false;
    }

    onMenuButtonClick(event: Event) {
        this.menuClick = true;

        if (!this.isMobile()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        } else {
            this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }

        event.preventDefault();
    }

    onMenuClick() {
        this.menuClick = true;
    }

    onTopbarMenuClick() {
        this.topbarMenuClick = true;
    }

    onTopbarItemClick(event: Event, item: Element) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        if (item.className === 'search-item') {
            this.search = !this.search;
            this.searchClick = !this.searchClick;
        }

        event.preventDefault();
    }

    onTopbarSubItemClick(event, type = null) {
        if (type === 'logout'){
            this.storage.clear('token');
            this.router.navigate(['/login']).then(r => {
                this.service.add({key: 'exit', severity: 'warn', summary: 'Atenção', detail: 'Sessão Encerrada!'});
            });
        }
        event.preventDefault();
    }

    onRippleChange(event) {
        this.app.ripple = event.checked;
        this.primengConfig = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    isMobile() {
        return window.innerWidth < 1025;
    }

    isSlim() {
        return this.app.menuMode === 'slim';
    }

    isStatic() {
        return this.app.menuMode === 'static';
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }
}
