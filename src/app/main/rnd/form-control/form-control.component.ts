import { Component, Injector } from '@angular/core';
import { AppComponentBase } from "@shared/common/app-component-base";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { appModuleAnimation } from 'shared/animations/routerTransition';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
@Component({
    templateUrl: './form-control.component.html',
    animations: [appModuleAnimation()]
})
export class FormControlComponent extends AppComponentBase implements OnInit {
    validationForm: FormGroup;
    model: MSInputDto;
    constructor(
        injector: Injector,
        private _fb: FormBuilder
    ) {
        super(injector);
        this.validationForm = _fb.group({
            'positionName': ['', Validators.compose([Validators.required, Validators.maxLength(25)])],
            'positionCode': ['', Validators.compose([Validators.required, Validators.maxLength(3), Validators.pattern(/^[a-zA-Z0-9\\s]*$/)])],
            'department': ['', Validators.required],
            'isActive': true
        });
    }
    ngOnInit(): void {
        this.model = new MSInputDto(); 
    }
    save(): void {
        console.log(this.model);
    }
}
class MSInputDto {
    id: number;
    positionName: string;
    positionCode: string;
    departmentID: number;
    isActive: boolean;
}
