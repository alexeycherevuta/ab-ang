import { Component, OnInit, Injector, ElementRef, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
@Component({
  templateUrl: './form-datepicker.component.html'
})
export class FormDatepickerComponent extends AppComponentBase  implements OnInit {
  dateSelected: any;
  constructor(
    injector: Injector,) 
  { 
    super(injector)
  }
  ngOnInit() {
  }
}
