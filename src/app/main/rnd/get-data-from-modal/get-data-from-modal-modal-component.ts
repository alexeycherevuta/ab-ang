import { Component, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
@Component({
    selector: 'getDataFromModalModal',
    templateUrl: './get-data-from-modal-modal-component.html',
    animations: [appModuleAnimation()]
})
export class GetDataFromModalModalComponent extends AppComponentBase {
    @ViewChild('modal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    public list: PersonListDto[];
    public myForm: FormGroup;
    firstName: string;
    lastName: string;
    model: PersonListDto;
    active: boolean = false;
    constructor(
        injector: Injector
    ) {
        super(injector);
        this.list = [];
        this.model = new PersonListDto();
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
    cancel(): void {
        this.modal.hide();
    }
    save(): void {
        this.list = [...this.list, this.model];
        this.model = new PersonListDto();
        this.modalSave.emit(null);
        console.log(this.list);
        this.modal.hide();
    }
    show() {
        this.active = true;
        this.modal.show();
    }
}
class PersonListDto {
    firstName: string;
    lastName: string;
}
