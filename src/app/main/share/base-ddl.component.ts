import {
    AfterContentInit,
    AfterViewInit, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges,
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
                                <option *ngFor="let a of data" [attr.data-object]="objectAsData ? stringify(a.object) : ''" value="{{a.value}}">{{a.label}}</option>
                            </select></div>`;
let selector = 'base-ddl';
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BaseDropDownListComponent),
    multi: true
};
export function getCustomInputControlValueAccessor(component) {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => component),
        multi: true
    };
}
export class BaseDropDownListComponent implements ControlValueAccessor, OnInit, AfterViewInit, AfterContentInit, OnChanges {
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;
    dropdownElement: ElementRef;
    innerValue: any = '';
    data: any[] = [];
    isLoading = true;
    listResult: any;
    labelField: any;
    valueField: any;
    objectAsData = false;
    @Input() input: any;
    @Input() isDisabled: boolean;
    @Input() emptyValueText = 'Nothing Selected';
    @Output() selectionChanged: EventEmitter<any> = new EventEmitter<any>();
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
            this.data.push({ value: '', label: this.emptyValueText, object: '' });
            this.isLoading = true;
            this.listResult.subscribe(result => {
                let items = [];
                if (result.items !== undefined) {
                    items = result.items;
                } else {
                    items = result;
                }
                items.forEach(function (value) {
                    let val = value[this.valueField];
                    if (this.valueField.constructor === Array) {
                        val = '';
                        this.valueField.forEach((val, index) => {
                            val += value[this.valueField[index]] + '|';
                        })
                        val = val.substring(0, val.length - 1);
                    }
                    let label = value[this.labelField];
                    if (this.labelField.constructor === Array) {
                        label = '';
                        this.labelField.forEach((val, index) => {
                            label += value[val];
                            label += ' - ';
                        });
                        label = label.substring(0, label.length - 3);
                    }
                    this.data.push({ value: val, label: label, object: value });
                }, this);
                this.isLoading = false;
                this.refreshAll();
            });
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.input.currentValue !== undefined) {
            this.retrieveByInput();
            if (!changes.input.firstChange) {
                this.loadAllData();
            }
        }
    }
    getDataObject() {
        if (this.dropdownElement !== undefined) {
            let sel = this.dropdownElement.nativeElement.selectedIndex;
            let x = $(this.dropdownElement.nativeElement.options[sel]).attr('data-object');
            if (x !== '') {
                let selectedObject = JSON.parse(x);
                return selectedObject;
            }
        }
        return null;
    }
    set inputValue(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.selectionChanged.emit({value: v, object: this.getDataObject()});
            this.onChangeCallback(v);
        }
    }
    onBlur() {
        this.onTouchedCallback();
    }
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            this.selectionChanged.emit({value: value, object: this.getDataObject()});
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
    stringify(obj) {
        return JSON.stringify(obj);
    }
}
