import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
@Component({
    templateUrl: './multiple-data.component.html',
    animations: [appModuleAnimation()]
})
export class MultipleDataComponent extends AppComponentBase {
    public list: PersonListDto[];
    public myForm: FormGroup;
    firstName: string;
    lastName: string;
    constructor(
        injector: Injector
    ) {
        super(injector);
        this.list = [];
    }
    ngOnInit() {
    }
    getList(): void { 
        this.primengDatatableHelper.records = this.list;
        this.primengDatatableHelper.totalRecordsCount = this.list.length;
    }
    deleteRow(index: number): void {
        this.list.splice(index, 1);
        this.list = [...this.list];
    }
    save(): void {
        console.log(this.list);
    }
    createPerson(): void {
        const input = new PersonListDto();
        input.firstName = this.firstName;
        input.lastName = this.lastName;
        this.list =  [ ...this.list, input];
        this.primengDatatableHelper.totalRecordsCount = this.list.length;
    }
}
class PersonListDto {
    firstName: string;
    lastName: string;
}
