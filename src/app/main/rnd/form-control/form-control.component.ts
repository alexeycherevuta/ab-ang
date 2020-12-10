import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from "@angular/forms";
export class modelCtrl{
    accCode:any
}
@Component({
    selector: 'demo-app',
    template: `
    <div class="m-portlet m-portlet--mobile">
    <div class="m-portlet__body">
        <p><span class="boldspan">Form data:</span>{{authForm.valid}}</p>
        <p><span class="boldspan">Model data:</span> {{dataModel}}</p>
        <form [formGroup]="authForm">
          <custom-input name="someValue" 
                          [formControl]="model_ctrl.accCode">
              Write in this wrapper control:
          </custom-input>
        </form>
    </div>
    </div>`
})
export class FormControlComponent {
    dataModel: string = '';
    authForm: any;
    model_ctrl:modelCtrl = new modelCtrl;
    constructor(injector: Injector, private _fb: FormBuilder) {
        this.authForm = _fb.group({
            'accCode': [null,Validators.compose([Validators.required,Validators.maxLength(5)])]
        })
        this.model_ctrl = this.r_control();
    }
    r_control(){
        return {
            accCode:this.authForm.controls['accCode'],
            accName:this.authForm.controls['accName'],
            accNo:this.authForm.controls['accNo'],
            isActive:this.authForm.controls['isActive']
        }
    }
}
