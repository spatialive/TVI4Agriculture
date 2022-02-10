import {Component} from '@angular/core';

@Component({
    templateUrl: './documentation.component.html',
    styles: [`
        .docs pre.doc-command {
            font-family: monospace;
			background-color: #2C2C2C;
			color: #ffffff;
            padding: 1em;
            font-size: 14px;
            border-radius: 3px;
            overflow: auto;
        }`
    ]
})
export class DocumentationComponent {
}
