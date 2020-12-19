import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from '@node_modules/angular2-counto';
import { EasyPieChartModule } from 'ng2modules-easypiechart';
import { SpinnerModule, EditorModule, DropdownModule, ButtonModule, DataTableModule, PaginatorModule } from 'primeng/primeng';
import { FileSelectDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module';
import { RnDRoutingModule } from 'app/main/rnd/rnd-routing.module';
import { MultipleDataComponent } from 'app/main/rnd/multiple-data/multiple-data.component';
import { ServiceProxyModule } from 'shared/service-proxies/service-proxy.module';
import { GetParamUrlComponent } from 'app/main/rnd/getparam-url/getparam-url.component';
import { GetParamUrlDetailComponent } from 'app/main/rnd/getparam-url/getparam-url-detail.component';
import { GetDataFromModalComponent } from 'app/main/rnd/get-data-from-modal/get-data-from-modal.component';
import { GetDataFromModalModalComponent } from 'app/main/rnd/get-data-from-modal/get-data-from-modal-modal-component';
import { FormDatepickerComponent } from 'app/main/rnd/form-datepicker/form-datepicker.component';
import { CleanModalComponent } from './clean-modal/clean-modal.component';
import { CleanModalModalComponent } from 'app/main/rnd/clean-modal/clean-modal-modal.component';
import { InputMaskComponent } from 'app/main/rnd/input-mask/input-mask.component';
import { ShareModule } from 'app/main/share/share.module';
import { FormControlComponent } from 'app/main/rnd/form-control/form-control.component';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        ServiceProxyModule,
        UtilsModule,
        AppCommonModule,
        DataTableModule,
        DropdownModule,
        PaginatorModule,
        ButtonModule,
        SpinnerModule,
        EditorModule,
        RnDRoutingModule,
        ReactiveFormsModule,
        FileUploadModule,
        ShareModule
    ],
    declarations: [
        MultipleDataComponent,
        GetParamUrlComponent,
        GetParamUrlDetailComponent,
        GetDataFromModalComponent,
        GetDataFromModalModalComponent,
        FormDatepickerComponent,
        CleanModalComponent,
        CleanModalModalComponent,
        InputMaskComponent,
        FormControlComponent,
    ]
})
export class RnDModule { }
