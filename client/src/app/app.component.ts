import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig, Translation} from 'primeng/api';
import {LocalizationService} from './@core/internationalization/localization.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    inputStyle = 'outlined';

    ripple: boolean;

    theme = 'indigo';

    layoutColor = 'white';

    colorScheme = 'light';

    menuMode = 'slim';

    constructor(private primengConfig: PrimeNGConfig, public localizationService: LocalizationService) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.ripple = true;
        this.localizationService.translateService.setDefaultLang('pt');
        this.localizationService.translateService.get('primeng').subscribe((res: Translation) => {
            this.primengConfig.setTranslation(res);
        });
    }
}
