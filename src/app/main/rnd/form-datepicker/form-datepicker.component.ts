import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  templateUrl: './form-datepicker.component.html'
})
export class FormDatepickerComponent extends AppComponentBase implements OnInit {
  datepickSelected: any;
  datetimepickSelected: any;
  validationForm: FormGroup;
  @ViewChild('datePickElement') datePickElement: ElementRef;
  constructor(
    injector: Injector,
    _fb: FormBuilder,
  ) { 
    super(injector);
    this.validationForm = _fb.group({
      'datepicker': [null, Validators.required],
      'datetimepicker': [null],
    });
  }
  ngOnInit() {
  }
  save(): void {
    let momentDate = this.strToMoment(this.datepickSelected).calendar();
    let momentDatetime = this.strToMoment(this.datetimepickSelected, undefined, true).calendar();
    console.log('datepicker value: '+this.datepickSelected);
    console.log('datepicker(mm/dd/yyyy) moment: '+momentDate);
    console.log('datetimepicker value: '+this.datetimepickSelected);
    console.log('datetimepicker(mm/dd/yyyy) moment: '+momentDatetime);
  }
  clearDate() {
    $(this.datePickElement.nativeElement).datepicker('update', '');
  }
}
