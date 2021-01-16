import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { UploadImageModalComponent } from 'app/main/rnd/upload-image/upload-image-modal.component';
import { ModalDirective } from 'ngx-bootstrap';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
@Component({
    templateUrl: './upload-image.component.html',
    animations: [appModuleAnimation()]
})
export class UploadImageComponent extends AppComponentBase implements  AfterViewChecked, AfterViewChecked {
    @ViewChild('uploadImageModal') modal: UploadImageModalComponent;
    public list: any;
    public myForm: FormGroup;
    constructor(
        injector: Injector
    ) {
        super(injector);
        this.list = [];
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        this.modal.show();
    }
    ngAfterViewChecked() {
    }
    save() {
        console.log(this.list);
    }
    uploadImage() {
    }
}
