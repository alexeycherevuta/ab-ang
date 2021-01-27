import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultipleDataComponent } from 'app/main/rnd/multiple-data/multiple-data.component';
import { GetParamUrlComponent } from 'app/main/rnd/getparam-url/getparam-url.component';
import { GetParamUrlDetailComponent } from 'app/main/rnd/getparam-url/getparam-url-detail.component';
import { GetDataFromModalComponent } from 'app/main/rnd/get-data-from-modal/get-data-from-modal.component';
import { FormDatepickerComponent } from 'app/main/rnd/form-datepicker/form-datepicker.component';
import { CleanModalComponent } from 'app/main/rnd/clean-modal/clean-modal.component';
import { InputMaskComponent } from 'app/main/rnd/input-mask/input-mask.component';
import { FormControlComponent } from 'app/main/rnd/form-control/form-control.component';
import { UploadFileComponent } from '@app/main/rnd/upload-file/upload-file.component';
import { CurrencyFormatViewComponent } from '@app/main/rnd/currency-format-view/currency-format-view.component';
const routes: Routes = [];
@NgModule({
  imports: [RouterModule.forChild([
    {
        path: '',
        children: [
          {
            path: "multiple-data", component: MultipleDataComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          },
          {
              path: "getparam-url",
              children: [
                  { path: '', component: GetParamUrlComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                  { path: 'detail/:idNya', component: GetParamUrlDetailComponent, data: { permission: 'Pages.Tenant.Dashboard' } }
              ]
          },
          {
            path: "get-data-from-modal", component: GetDataFromModalComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          },
          {
            path: "form-date-picker", component: FormDatepickerComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          },
          {
            path: "form-control", component: FormControlComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          },
          {
            path: "clean-modal", component: CleanModalComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          },
          {
            path: "input-mask", component: InputMaskComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          },
          {
            path: "upload-file", component: UploadFileComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          },
          {
            path: "currency-format-view", component: CurrencyFormatViewComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          }
      ]
    }
  ])],
  exports: [RouterModule]
})
export class RnDRoutingModule { }
