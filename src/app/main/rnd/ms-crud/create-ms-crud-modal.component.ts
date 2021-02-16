import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserServiceProxy, CreateOrUpdateUserInput } from 'shared/service-proxies/service-proxies';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { ValidationService } from "@app/shared/common/share/validation.service";
@Component({
    selector: 'createModal',
    templateUrl: './create-ms-crud-modal.component.html',
})
export class CreateMsCrudModalComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    active: boolean = false;
    saving: boolean = false;
    model: CreateOrUpdateUserInput;
    authForm: FormGroup;
    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _fb: FormBuilder
    ) {
        super(injector);
        this.authForm = this._fb.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(32)])],
            surname: [null, Validators.compose([Validators.required, Validators.maxLength(32)])],
            username: [null, Validators.compose([Validators.required, Validators.maxLength(32)])],
            emailAddress: [null, Validators.compose([Validators.required, Validators.maxLength(256), ValidationService.emailCompleteValidator])],
            phoneNumber: [null, Validators.compose([Validators.maxLength(24), ValidationService.numValidator])]
        });
    }
    ngOnInit() {
        this.model = new CreateOrUpdateUserInput();
    }
    show(): void {
        this.active = true;
        this.modal.show();
        this.model.user.phoneNumber = '';
    }
    save(event): void {
        this.saving = true;
        if (event) {
            this.model.setRandomPassword = true;
            this.model.sendActivationEmail = false;
            this._userService.createOrUpdateUser(this.model)
                .finally(() => this.saving = false)
                .subscribe(() => {
                    this.notify.success(this.l('SavedSuccessfully'));
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
