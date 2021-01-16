import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
@Component({
    templateUrl: './datatable-form.component.html',
    animations: [appModuleAnimation()]
})
export class DatatableFormComponent extends AppComponentBase {
    public myForm: FormGroup;
    memberStatusList: any[];
    pointTypeList: any[];
    uplineList: any[];
    schemaList: any[];
    statusList: any[];
    selectedSchema: any;
    constructor(
        injector: Injector,
    ) {
        super(injector);
        this.memberStatusList = [
            {label:'', value:null },            
            {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
            {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}},
            {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
            {label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}},
            {label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}}
        ];
        this.pointTypeList = [
            {label:'', value:null },            
            {label:'asds', value:{id:1, name: 'New York', code: 'NY'}},
            {label:'sa', value:{id:2, name: 'Rome', code: 'RM'}},
            {label:'sa', value:{id:3, name: 'London', code: 'LDN'}},
            {label:'qwe', value:{id:4, name: 'Istanbul', code: 'IST'}},
            {label:'sdsa', value:{id:5, name: 'Paris', code: 'PRS'}}
        ];
        this.statusList = [
            {label:'', value:null },
            {label:'Active', value:{id:'true', name: 'Active'}},
            {label:'Inactive', value:{id:'false', name: 'Inactive'}},
        ];
        this.schemaList = [];
        this.uplineList = [
            {label:'', value:null },
            {label:'asdfsd', value:{id:'asds', name: 'aaaa'}},
            {label:'aaaa', value:{id:'aaaa', name: 'wwerer'}},
        ];
    }
    ngOnInit() {
    }
    getPointPercentages(): void { 
    }
    createPointPercentage(): void {
    }
    save() {
    }
    deleteRow(col: any) {
    }
}
