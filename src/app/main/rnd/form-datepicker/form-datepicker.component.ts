import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-form-datepicker',
  templateUrl: './form-datepicker.component.html'
})
export class FormDatepickerComponent extends AppComponentBase  implements OnInit {
  public selectedDate: any;
  public dateTimePickerOptions: any;
  editForm: FormGroup;
  @ViewChild('SampleDatePicker') sampleDatePicker: ElementRef;
  @ViewChild('SampleDateTimePicker') sampleDateTimePicker: ElementRef;
  constructor(
    injector: Injector,
    private _fb: FormBuilder,) 
  { 
    super(injector)
    this.dateTimePickerOptions = {
      locale: abp.localization.currentLanguage.name,
      format: 'L'
    };
    this.editForm = _fb.group({
      'datepicker': [null],
      'datepicker1': [null],      
    })
  }
  ngAfterViewInit(): void {
    $(this.sampleDatePicker.nativeElement).datetimepicker({
        locale: abp.localization.currentLanguage.name,
        format: 'L'
    });
  }
  ngOnInit() {
    $(this.sampleDatePicker.nativeElement).datetimepicker().on('dp.change',function(e){
      let dateInput = moment(e.date.format('YYYY-MM-DDTHH:mm:ssZ'));
      this.selectedDate = dateInput.date
      console.log(dateInput.format('MM/DD/YYYY'))
    })
  }
  dateSelected() {
    let dateInput = moment($(this.sampleDatePicker.nativeElement).data('DateTimePicker').date().format('YYYY-MM-DDTHH:mm:ssZ'));
    this.selectedDate = dateInput.date
  }
  submitDate(): void {
    let dateInput = moment($(this.sampleDatePicker.nativeElement).data('DateTimePicker').date().format('YYYY-MM-DDTHH:mm:ssZ'));
    console.log(dateInput)
    console.log(this.selectedDate)
  }
}
