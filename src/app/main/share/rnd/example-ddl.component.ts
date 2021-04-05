import { AfterContentInit, Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { BaseDropDownListComponent, getCustomInputControlValueAccessor, templateString } from '@app/main/share/base-ddl.component';
import { RoleServiceProxy } from '@shared/service-proxies/service-proxies';
@Component({
    template: templateString,
    selector: 'example-ddl',
    providers: [getCustomInputControlValueAccessor(ExampleDdlComponent), BaseDropDownListComponent]
})
export class ExampleDdlComponent extends BaseDropDownListComponent implements AfterContentInit {
    @ViewChild('dropdownElement', {read: ElementRef}) el;
    listResult = this._roleService.getRoles(undefined);
    labelField = 'displayName';
    valueField = 'id';
    isLoading = true;
    constructor(
        private _roleService: RoleServiceProxy,
    ) {
        super();
    }
    ngAfterContentInit() {
        this.setDropdownElement(this.el);
    }
}
