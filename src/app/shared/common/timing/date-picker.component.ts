import { Directive, AfterViewInit, ElementRef, ViewChild, Injector, Input, Output, EventEmitter, Optional } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { NgControl } from '@angular/forms';
@Directive({
    selector: '[datePicker]',
})
export class DatePickerDirective extends AppComponentBase implements AfterViewInit {
    hostElement: ElementRef;
    _selectedDate: moment.Moment = moment().startOf('day');
    @Output() selectedDateChange = new EventEmitter();
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    @Input('dateType') private dateType = '';
    @Input()
    get selectedDate() {
        return this._selectedDate;
    }
    set selectedDate(val) {
        this._selectedDate = val;
        this.selectedDateChange.emit(this._selectedDate);
        this.setElementText(val);
        this.ngModelChange.emit(val.format('MM/DD/YYYY'));
    }
    constructor(
        injector: Injector,
        private _element: ElementRef,
        @Optional() private control: NgControl,
    ) {
        super(injector);
        this.hostElement = _element;
    }
    ngAfterViewInit(): void {
        const $element = $(this.hostElement.nativeElement);
        if(this.dateType === 'datetime') {
            $element.datetimepicker().on('dp.change', this.handleChange);;
        } else {
            $element.datepicker({
                language: abp.localization.currentLanguage.name
            }).on('changeDate', e => {
                this.selectedDate = moment(e.date);
            }).on('clearDate', e => {
                this.selectedDate = null;
            });
        }
    }
    private handleChange: (any) => void = (event: any):void => {
        let dateInput = moment(event.date.format('YYYY-MM-DDTHH:mm:ssZ'));
        event.dateInput = dateInput
        this.control.control.patchValue(event.dateInput.format('MM/DD/YYYY h:mm a'));
    }
    setElementText(val: any) {
        const $element = $(this.hostElement.nativeElement);
        if (val) {
            $element.val(moment(val).format('L'));
        } else {
            $element.val('');
        }
    }
}
