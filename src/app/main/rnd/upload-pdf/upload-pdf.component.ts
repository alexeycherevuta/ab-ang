import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { TokenService } from 'abp-ng2-module/src/auth/token.service';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { AppConsts } from 'shared/AppConsts';
import { IAjaxResponse } from 'abp-ng2-module/src/abpHttp';
@Component({
  selector: 'app-upload-pdf',
  templateUrl: './upload-pdf.component.html'
})
export class UploadPdfComponent extends AppComponentBase implements OnInit {
  public uploader1: FileUploader;  
  private _uploaderOptions: FileUploaderOptions = {};
  selectedFile = FileList;    
  temporaryPictureUrl: string;
  constructor(
    injector: Injector,
    private _tokenService: TokenService
  ) { 
    super(injector)
  }
  initFileUploader(): void {
    const self = this;
    self.uploader1 = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + '/Profile/UploadProfilePicture' });
    self._uploaderOptions.autoUpload = true;
    self._uploaderOptions.authToken = 'Bearer ' + self._tokenService.getToken();
    self._uploaderOptions.removeAfterUpload = true;
    self.uploader1.onAfterAddingFile = (file) => {
        file.withCredentials = false;
    }
    self.uploader1.onSuccessItem = (item, response, status) => {
        const resp = <IAjaxResponse>JSON.parse(response);
        if (resp.success) {
            let temporaryPictureFileName = resp.result.fileName;
            this.temporaryPictureUrl = AppConsts.remoteServiceBaseUrl + '/Temp/Downloads/' + resp.result.fileName + '?v=' + new Date().valueOf();
            console.log(this.temporaryPictureUrl)
        } else {
            this.message.error(resp.error.message);
        }
    }
    self.uploader1.setOptions(self._uploaderOptions);
  }
  detectFile(event) {
    this.selectedFile = event.target.files;
    console.log(this.selectedFile)
  }   
  ngOnInit() {
    this.initFileUploader();
  }
  save(): void {
  }
}
