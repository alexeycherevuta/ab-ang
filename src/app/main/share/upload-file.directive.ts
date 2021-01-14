import { Directive, ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit, Optional, EventEmitter, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as _ from 'lodash';
import { FileSelectDirective, FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { TokenService } from 'abp-ng2-module/dist/src/auth/token.service';
import { IAjaxResponse } from 'abp-ng2-module/dist/src/abpHttp';
@Directive({
    selector: '[fileUpload]',
})
export class UploadFileDirective extends FileSelectDirective implements OnChanges, OnInit {
    @Input('fileUpload')
    fileUpload: string;
    @Input('options')
    options: any = {
        max_file_size: 1048576,
        type: 'pdf|jpg|jpeg|png|xlsx|xls|csv',
        url: 'UploadRenovationFile',
        pictureUrl: 'RenovationFile',
    };
    @Output() onAfterAddingFile: EventEmitter<string> = new EventEmitter<string>();
    @Output() onAfterFileUpload: EventEmitter<string> = new EventEmitter<string>();
    @Output() onFileUploadError: EventEmitter<string> = new EventEmitter<string>();
    @Output() pictureUrl: EventEmitter<string> = new EventEmitter<string>();
    private _uploaderOptions: FileUploaderOptions = {};
    temporaryPictureUrl: string = '';
    isLoading = false;
    uploadedFileNameBackup;
    uploadedFileName;
    constructor(
        private elementRef: ElementRef,
        @Optional() private control: NgControl,
        private _tokenService: TokenService
    ) {
        super(elementRef);
    }
    ngOnInit() {
        this.initFileUploader();
    }
    initFileUploader() {
        const self = this;
        self.uploader = new FileUploader({
            url: `${AppConsts.remoteServiceBaseUrl}/Profile/` + this.options['url'],
            filters: [{
                name: 'imageFilter',
                fn: this.uploadFile
            }]
        });
        self._uploaderOptions.autoUpload = true;
        self._uploaderOptions.authToken = 'Bearer ' + self._tokenService.getToken();
        self._uploaderOptions.removeAfterUpload = true;
        self.uploader.onAfterAddingFile = (file) => {
            this.isLoading = true;
            abp.ui.setBusy($(this.elementRef.nativeElement.parentNode));
            this.onAfterAddingFile.emit(null);
            file.withCredentials = false;
        };
        self.uploader.onSuccessItem = (item, response, status) => {
            const resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                let temporaryPictureFileName = resp.result.fileName;
                this.temporaryPictureUrl = AppConsts.remoteServiceBaseUrl + '/Temp/Downloads/' + this.options['pictureUrl'] + '/' + resp.result.fileName + '?v=' + new Date().valueOf();
                this.onAfterFileUpload.emit(temporaryPictureFileName);
                this.pictureUrl.emit(this.temporaryPictureUrl);
            } else {
                abp.message.error("File upload error!");
            }
            this.isLoading = false;
            abp.ui.clearBusy($(this.elementRef.nativeElement.parentNode));
        };
        self.uploader.onErrorItem = (item, response, status, headers) => {
            this.onFileUploadError.emit(null);
            abp.ui.clearBusy($(this.elementRef.nativeElement.parentNode));
        };
        self.uploader.setOptions(self._uploaderOptions);
    }
    ngOnChanges(): void {
        if (!this.control) {
            console.warn('No control for UploadFileDirective');
            return;
        }
    }
    uploadFile: (any1, any2) => boolean = (item: any, options: any): boolean => {
        let vm = this;
        vm.uploadedFileNameBackup = item.name;
        let type: string = item.name.slice(item.name.lastIndexOf('.') + 1);
        if (this.options.type.indexOf(type.toLowerCase()) === -1) {
            this.control.control.setValue('');
            vm.uploadedFileName = null;
            vm.uploadedFileNameBackup = null;
            abp.message.warn("Type file " + type.replace('|', '') + " is not allowed!");
            this.onFileUploadError.emit(null);
            return false;
        }
        if (item.size > this.options.max_file_size) {
            this.control.control.setValue('');
            abp.message.warn("File size is too large!");
            vm.uploadedFileName = null;
            vm.uploadedFileNameBackup = null;
            this.onFileUploadError.emit(null);
            return false;
        }
        return true;
    }
    public clean() {
        this.elementRef.nativeElement.value = '';
        this.temporaryPictureUrl = '';
    }
    private handleChange: (any) => void = (event: any): void => {
        this.control.control.patchValue(this.elementRef.nativeElement.value);
    }
}
