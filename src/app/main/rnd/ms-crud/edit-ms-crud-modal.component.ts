import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserServiceProxy, CreateOrUpdateUserInput } from 'shared/service-proxies/service-proxies';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "@app/shared/common/share/validation.service";
@Component({
    selector: 'editModal',
    templateUrl: './edit-ms-crud-modal.component.html',
})
export class EditMsCrudModalComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    active: boolean = false;
    saving: boolean = false;
    model: CreateOrUpdateUserInput;
    authForm: FormGroup;
    editTitle: string = '';
    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _fb: FormBuilder,
    ) {
        super(injector);
        this.model = new CreateOrUpdateUserInput();
        this.authForm = this._fb.group({
            'name': [null, Validators.compose([Validators.required, Validators.maxLength(32)])],
            'surname': [null, Validators.compose([Validators.required, Validators.maxLength(32)])],
            'username': [null, Validators.compose([Validators.required, Validators.maxLength(32)])],
            'emailAddress': [null, Validators.compose([Validators.required, Validators.maxLength(256), ValidationService.emailCompleteValidator])],
            'phoneNumber': [null, Validators.compose([Validators.maxLength(24), ValidationService.numValidator])]
        });
    }
    show(record: any): void {
        Object.assign(this.model.user, record);
        this.editTitle = record.name+' - '+record.emailAddress
        this.active = true;
        this.modal.show();
        this.model.user.phoneNumber = this.isEmptyValue(this.model.user.phoneNumber) ? '' : this.model.user.phoneNumber;
    }
    save(event): void {
        this.saving = true;
        if (event) {
            this.model.setRandomPassword = true;
            this.model.sendActivationEmail = false;
            this._userService.createOrUpdateUser(this.model)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('UpdatedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
        } else {
            this.message.warn(this.l('InvalidFormMessage'));
            this.saving = false;
        }
    }
    close(): void {
        this.authForm.reset();
        this.modal.hide();
        this.active = false;
    }
}
