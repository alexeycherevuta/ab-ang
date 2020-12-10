import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { GetDataFromModalModalComponent } from 'app/main/rnd/get-data-from-modal/get-data-from-modal-modal-component';
@Component({
    templateUrl: './get-data-from-modal.component.html',
    animations: [appModuleAnimation()]
})
export class GetDataFromModalComponent extends AppComponentBase {
    @ViewChild('getDataFromModalModal') modal: GetDataFromModalModalComponent;
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
        this.modal.list = [];
        this.getList();
    }
    getList(): void { 
        this.primengDatatableHelper.records = this.modal.list;
        this.primengDatatableHelper.totalRecordsCount = this.list.length;
    }
    deleteRow(index: number): void {
        this.modal.list.splice(index, 1);
        this.modal.list = [...this.modal.list];
        this.getList();
    }
    cancel(): void {
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
