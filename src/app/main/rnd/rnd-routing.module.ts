import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultipleDataComponent } from 'app/main/rnd/multiple-data/multiple-data.component';
import { GetParamUrlComponent } from 'app/main/rnd/getparam-url/getparam-url.component';
import { GetParamUrlDetailComponent } from 'app/main/rnd/getparam-url/getparam-url-detail.component';
import { GetDataFromModalComponent } from 'app/main/rnd/get-data-from-modal/get-data-from-modal.component';
import { FormDatepickerComponent } from 'app/main/rnd/form-datepicker/form-datepicker.component';
import { CleanModalComponent } from 'app/main/rnd/clean-modal/clean-modal.component';
import { InputMaskComponent } from 'app/main/rnd/input-mask/input-mask.component';
const routes: Routes = [];
@NgModule({
  imports: [RouterModule.forChild([
    {
        path: '',
        children: [
          {
            path: "multipleData", component: MultipleDataComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          },
          {
              path: "getparamUrl",
              children: [
                  { path: '', component: GetParamUrlComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                  { path: 'detail/:idNya', component: GetParamUrlDetailComponent, data: { permission: 'Pages.Tenant.Dashboard' } }
              ]
          },
          {
            path: "getDataFromModal", component: GetDataFromModalComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          },
          {
            path: "formDatePicker", component: FormDatepickerComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          },
          {
            path: "cleanModal", component: CleanModalComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          },
          {
            path: "inputMask", component: InputMaskComponent, data: { permission: 'Pages.Tenant.Dashboard' },
          }
      ]
    }
  ])],
  exports: [RouterModule]
})
export class RnDRoutingModule { }
