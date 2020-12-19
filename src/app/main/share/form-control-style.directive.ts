import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
@Directive({ selector: '[formControlStyle]' })
export class FormControlStyleDirective implements OnInit {
    static VALID_STYLE: string = 'has-success';
    static INVALID_STYLE: string = 'has-danger';
    @Input('formControlStyle') private formGroup: FormGroup;
    @Input('formComponent') private formComponent = '';
    private component: FormControl;
    constructor(private el: ElementRef) { }
    ngOnInit(): void {
        let componentName: string;
        let inputElement = null;
        if (this.formComponent !== '') {
            inputElement = this.el.nativeElement.querySelector(this.formComponent);
        } else {
            inputElement = this.el.nativeElement.querySelector('input');
        }
        if (inputElement) {
            componentName = inputElement.getAttribute('formControlName');
        }
        if (!componentName) {
            console.error('FormValidationStyleDirective: Unable to get the control name. Is the formControlName attribute set correctly?');
            return;
        }
        let control = this.formGroup.get(componentName);
        if (!(control instanceof FormControl)) {
            console.error(`FormValidationStyleDirective: Unable to get the FormControl from the form and the control name: ${componentName}.`);
            return;
        }
        this.component = control as FormControl;
        this.component.statusChanges.subscribe((status) => {
            this.onStatusChange(status, this.component.dirty);
        });
        this.onStatusChange(this.component.status, this.component.dirty);
    }
    onStatusChange(status: string, dirty: boolean): void {
        let cl = this.el.nativeElement.classList;
        if (status === 'VALID' && dirty) {
            cl.add(FormControlStyleDirective.VALID_STYLE);
            cl.remove(FormControlStyleDirective.INVALID_STYLE);
        } else if (status === 'INVALID' && dirty) {
            cl.add(FormControlStyleDirective.INVALID_STYLE);
            cl.remove(FormControlStyleDirective.VALID_STYLE);
        } else {
            cl.remove(FormControlStyleDirective.VALID_STYLE);
            cl.remove(FormControlStyleDirective.INVALID_STYLE);
        }
    }
}
