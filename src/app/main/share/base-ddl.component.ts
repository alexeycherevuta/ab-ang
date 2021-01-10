import {
    AfterContentInit,
    AfterViewInit, ElementRef, forwardRef, Input, OnChanges, OnInit, SimpleChanges,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
const noop = () => {
};
export let templateString = `<div [busyIf]="isLoading"><select #dropdownElement
                            [disabled]="isDisabled"
                            class="form-control"
                            [attr.data-live-search]="true"
                            [(ngModel)]="inputValue"
                            (blur)="onBlur()">
                                <option *ngFor="let a of data" value="{{a.value}}">{{a.label}}</option>
                            </select></div>`;
let selector = 'base-ddl';
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BaseDropDownListComponent),
    multi: true
};
export class BaseDropDownListComponent implements ControlValueAccessor, OnInit, AfterViewInit, AfterContentInit, OnChanges {
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;
    dropdownElement: ElementRef;
    innerValue: any = '';
    data: any[] = [];
    isLoading = true;
    listResult: any;
    labelField: string;
    valueField: any;
    @Input() input: any;
    @Input() isDisabled: boolean;
    @Input() emptyValueText = 'Nothing Selected';
    constructor() {
    }
    get inputValue(): any {
        return this.innerValue;
    }
    ngOnInit(): void {
    }
    loadAllData(): void {
        if (this.listResult !== undefined) {
            this.data = [];
            this.data.push({ value: '', label: this.emptyValueText });
            this.isLoading = true;
            this.listResult.subscribe(result => {
                result.items.forEach(function (value) {
                    let val;
                    if (this.valueField.constructor === Array) {
                        val = '';
                        for (let i = 0 ; i < this.valueField.length ; i++) {
                            val += value[this.valueField[i]] + '|'; 
                        }
                    } else {
                        val = value[this.valueField];
                    }
                    this.data.push({ value: val, label: value[this.labelField] });
                }, this);
                this.isLoading = false;
                this.refreshAll();
            });
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.input.currentValue !== undefined) {
            this.retrieveByInput();
            this.loadAllData();
        }
    }
    set inputValue(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }
    onBlur() {
        this.onTouchedCallback();
    }
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            this.refreshAll();
        }
    }
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    refreshAll(dropdownElement?): void {
        let self = this;
        if (self.dropdownElement !== undefined) {
            setTimeout(() => {
                $(self.dropdownElement.nativeElement).selectpicker('refresh');
            }, 0);
        } else
        if (dropdownElement !== undefined) {
            setTimeout(() => {
                $(dropdownElement.nativeElement).selectpicker('refresh');
            }, 0);
            self.dropdownElement = dropdownElement;
        }
    }
    ngAfterViewInit(): void {
    }
    ngAfterContentInit() {
        this.refreshAll();
    }
    setDropdownElement(v: any): void {
        if (v !== this.dropdownElement && v !== undefined) {
            this.dropdownElement = v;
            this.refreshAll(v);
            this.loadAllData();
        }
    }
    retrieveByInput(): void {
    }
}
