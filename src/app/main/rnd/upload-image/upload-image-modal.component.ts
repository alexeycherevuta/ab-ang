import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { AppConsts } from '@shared/AppConsts';
import { TokenService } from '@abp/auth/token.service';
import { IAjaxResponse } from 'abp-ng2-module/src/abpHttp';
@Component({
    selector: 'uploadImageModal',
    templateUrl: './upload-image-modal.component.html',
    animations: [appModuleAnimation()]
})
export class UploadImageModalComponent extends AppComponentBase {
    @ViewChild('modal') modal: ModalDirective;
    active:boolean = true;
    uploadedFileName = [];
    uploadedFileUrl = [];
    selectedFile = FileList;    
    selectedFiles = FileList;
    public uploader1: FileUploader;    
    public uploader2: FileUploader;
    temporaryPictureUrl: string;
    saving = false;
    private maxProfilPictureBytesUserFriendlyValue = 5;
    private temporaryPictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};
    private _$pictureResize: JQuery;
    private _$multiplePictureResize: JQuery[];
    private _$jcropApi: any;
    constructor(
        injector: Injector,
        private _tokenService: TokenService
    ) {
        super(injector);
    }
    ngOnInit() {
    }
    show() {
        this.modal.show();
    }
    onShown(): void {
        this.active = true;
        this.temporaryPictureUrl = '';
        this.temporaryPictureFileName = '';
        this._$pictureResize = null;
        this._$multiplePictureResize = [];
        this._$jcropApi = null;
        this.initFileUploader();
        this._$pictureResize = $('#ProfilePictureResize');
        this._$multiplePictureResize[0] = $('#ProfilePictureResize0');
        this._$multiplePictureResize[1] = $('#ProfilePictureResize1');
        this._$multiplePictureResize[2] = $('#ProfilePictureResize2');
        this._$multiplePictureResize[3] = $('#ProfilePictureResize3');                
    }
    initFileUploader(): void {
        const self = this;
        self.uploader1 = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + '/Profile/UploadProfilePicture' });
        self.uploader2 = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + '/Profile/UploadProfilePicture' });
        self._uploaderOptions.autoUpload = true;
        self._uploaderOptions.authToken = 'Bearer ' + self._tokenService.getToken();
        self._uploaderOptions.removeAfterUpload = true;
        self.uploader1.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        }
        self.uploader2.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
        self.uploader1.onSuccessItem = (item, response, status) => {
            const resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                self.temporaryPictureFileName = resp.result.fileName;
                self.temporaryPictureUrl = AppConsts.remoteServiceBaseUrl + '/Temp/Downloads/' + resp.result.fileName + '?v=' + new Date().valueOf();
                const newCanvasHeight = resp.result.height * self._$multiplePictureResize[0].width() / resp.result.width;
                self._$pictureResize.height(newCanvasHeight + 'px');
                self._$pictureResize.attr('src', self.temporaryPictureUrl);
                self._$pictureResize.attr('originalWidth', resp.result.width);
                self._$pictureResize.attr('originalHeight', resp.result.height);                
            } else {
                this.message.error(resp.error.message);
            }
        }
        self.uploader2.onSuccessItem = (item, response, status) => {
            const resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                self.temporaryPictureFileName = resp.result.fileName;
                self.temporaryPictureUrl = AppConsts.remoteServiceBaseUrl + '/Temp/Downloads/' + resp.result.fileName + '?v=' + new Date().valueOf();
                const newCanvasHeight = resp.result.height * self._$multiplePictureResize[this.uploadedFileName.length - 1].width() / resp.result.width;
                self._$multiplePictureResize[this.uploadedFileName.length - 1].height(newCanvasHeight + 'px');
                self._$multiplePictureResize[this.uploadedFileName.length - 1].attr('src', self.temporaryPictureUrl);
                self._$multiplePictureResize[this.uploadedFileName.length - 1].attr('originalWidth', resp.result.width);
                self._$multiplePictureResize[this.uploadedFileName.length - 1].attr('originalHeight', resp.result.height);
                this.uploadedFileUrl.push(self._$multiplePictureResize[this.uploadedFileName.length - 1].attr('src'));
            } else {
                this.message.error(resp.error.message);
            }
        };
        self.uploader1.setOptions(self._uploaderOptions);
        self.uploader2.setOptions(self._uploaderOptions);
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
    save(): void {
        const self = this;
        if (!self.temporaryPictureFileName) {
            return;
        }
        console.log(this.uploadedFileUrl);
    }
    detectFile(event) {
        this.selectedFile = event.target.files;
    }    
    detectFiles(event) {
        this.selectedFiles = event.target.files;
        if (event.target.files.length > 4) {
            this.message.error(this.l('PleaseSelectMax4Files'));
            event.preventDefault();
        }
        this.uploadedFileName.push(this.selectedFiles.name);
    }
    uploadSingle() {
        console.log(this.selectedFiles);
        let file = this.selectedFiles;
    }
}
