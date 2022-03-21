import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
        const control = controls.get(controlName);
        const checkControl = controls.get(checkControlName);
        if (checkControl?.errors && !checkControl.errors.matching) {
            return null;
        }
        if (control?.value !== checkControl?.value) {
            controls.get(checkControlName)?.setErrors({ matching: true });
            return { matching: true };
        } else {
            return null;
        }
    };
}
