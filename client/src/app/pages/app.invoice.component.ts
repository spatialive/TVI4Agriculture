import {Component} from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
    templateUrl: './app.invoice.component.html'
})
export class AppInvoiceComponent {

    constructor(public app: AppComponent) {}

    print() {
        window.print();
    }
}
