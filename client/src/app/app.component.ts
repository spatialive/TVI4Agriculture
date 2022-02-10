import {Component, OnInit} from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

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

    constructor(private primengConfig: PrimeNGConfig) {
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.ripple = true;
    }
}
