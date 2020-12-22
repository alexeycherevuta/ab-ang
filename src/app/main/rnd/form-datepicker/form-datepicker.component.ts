import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
@Component({
  templateUrl: './form-datepicker.component.html'
})
export class FormDatepickerComponent extends AppComponentBase  implements OnInit {
  datepickSelected: any;
  datetimepickSelected: any;
  constructor(
    injector: Injector,) 
  { 
    super(injector)
  }
  ngOnInit() {
  }
  save(): void {
    console.log(this.datepickSelected + " "+ this.datetimepickSelected);
  }
}
