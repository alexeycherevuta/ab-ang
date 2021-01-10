import { forwardRef, Component, OnInit, AfterViewInit, ElementRef, ViewChild, Injector, Input, Output, EventEmitter } from '@angular/core';
import { MsEntityServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
const noop = () => {
};
@Component({
    selector: 'entity-combo',
    template:
        `<select #EntityCombobox
        class="form-control"
        [(ngModel)]="inputValue"
        [attr.data-live-search]="true"
        (ngModelChange)="selectedEntityChange.emit($event)">
            <option [ngValue]="undefined">{{l('NothingSelected')}}</option>
            <option *ngFor="let a of entityList" [ngValue]="usingCode ? a.entityCode : a.id">{{a.entityName}}</option>
    </select>`,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => EntityComboComponent), multi: true }
    ]
})
export class EntityComboComponent extends AppComponentBase implements OnInit, AfterViewInit, ControlValueAccessor {
    @ViewChild('EntityCombobox') entityComboboxElement: ElementRef;
    entityList: any[] = [];
    @Input() usingCode: boolean = false;
    @Output() selectedEntityChange: EventEmitter<any> = new EventEmitter<any>();
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;
    private innerValue: any = '';
    constructor(
        private _msEntityService: MsEntityServiceProxy,
        injector: Injector) {
        super(injector);
    }
    ngOnInit(): void {
        let self = this;
        this._msEntityService.getMsEntityDropdown().subscribe(result => {
            this.entityList = result.items;
            this.refreshAll()
        }, err => {
            this.refreshAll()
        })
    }
    refreshAll(): void {
        let self = this;
        setTimeout(() => {
            $(self.entityComboboxElement.nativeElement).selectpicker('refresh');
        }, 0);
    }
    ngAfterViewInit(): void {
        $(this.entityComboboxElement.nativeElement).selectpicker({
            iconBase: 'famfamfam-flag',
            tickIcon: 'la la-check'
        });
    }
    ngOnChanges() {
        let self = this;
        self.refreshAll()
    }
    get inputValue(): any {
        return this.innerValue;
    }
    set inputValue(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
            this.refreshAll()
        }
    }
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            this.refreshAll()
        }
    }
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
