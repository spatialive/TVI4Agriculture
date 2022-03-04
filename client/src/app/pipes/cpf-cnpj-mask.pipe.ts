import { Pipe, PipeTransform } from '@angular/core';
import { MaskPipe } from 'ngx-mask';

@Pipe({
    name: 'cpfCnpjMask'
})
export class CpfCnpjMaskPipe implements PipeTransform {

    constructor(private maskPipe: MaskPipe) {
    }

    transform(value: string): any {
        return value ? this.maskPipe.transform(value, value.length === 11 ? '000.000.000-00' : '00.000.000/0000-00') : '';
    }

}
