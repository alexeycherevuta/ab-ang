import { AppComponentBase } from "@shared/common/app-component-base";
import { Component, Injector } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
@Component({
    templateUrl: './upload-file.component.html',
    animations: [appModuleAnimation()]
})
export class UploadFileComponent extends AppComponentBase {
    saving: boolean = false;
    uploadedFileName = null;
    uploadedFileNamePastSrc = null;
    uploadedFileNamePast = null;
    authForm: FormGroup;
    dataUpload: DataUpload = new DataUpload();
    optionsFile = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadFileExample',
        pictureUrl: 'UploadFileExample',
    }
    constructor(
        injector: Injector,
        private _fb: FormBuilder,
    ) {
        super(injector);
        this.authForm = this._fb.group({
            username: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            profile: [null],
        });
    }
    save(): void {
        this.saving = true;
        this.dataUpload.profile = this.uploadedFileName;
        console.log(this.dataUpload);
        this.saving = false;
    }
    pictureUrl(event): void {
        this.uploadedFileNamePastSrc = event.toString();
    }
    afterFileUploaded(event): void {
        abp.notify.success(this.l('FileUploaded'));
        this.uploadedFileName = event.toString();
    }
    delImage(): void {
        this.uploadedFileName = null;
        $("input[type='file']").val(null);
        this.uploadedFileNamePastSrc = null;
    }
}
class DataUpload {
    username: string;
    profile: string;
}
