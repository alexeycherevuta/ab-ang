import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { InputPointPctDto, MsSchemaServiceProxy } from 'shared/service-proxies/service-proxies';
@Component({
    templateUrl: './datatable-form.component.html',
    animations: [appModuleAnimation()]
})
export class DatatableFormComponent extends AppComponentBase {
    public list: InputPointPctDto[];
    public myForm: FormGroup;
    memberStatusList: any[];
    pointTypeList: any[];
    uplineList: any[];
    schemaList: any[];
    statusList: any[];
    selectedSchema: any;
    constructor(
        injector: Injector,
        private _msSchemaServiceProxy: MsSchemaServiceProxy,
    ) {
        super(injector);
        this.list = [];
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
        this._msSchemaServiceProxy.getAllMsSchema(1, '', 100, 0).subscribe(result=>{
            for(var i = 0 ; i < result.items.length ; i++) {
                let option = {label: result.items[i]['scmName'], value:{id: result.items[i]['schemaID'], name: result.items[i]['scmName']}};
                this.schemaList.push(option);
            }
        }, err=>{
            console.error(err)
        });
    }
    getPointPercentages(): void { 
        this.primengDatatableHelper.records = this.list;
        this.primengDatatableHelper.totalRecordsCount = this.list.length;
    }
    createPointPercentage(): void {
        const input = new InputPointPctDto();
        input.schemaID = 0;  
        this.list =  [ ...this.list, input];
        this.primengDatatableHelper.totalRecordsCount = this.list.length;
    }
    save() {
        console.log(this.list);
    }
    deleteRow(col: any) {
        this.list.splice(col, 1)
        this.list = [...this.list];
    }
}
