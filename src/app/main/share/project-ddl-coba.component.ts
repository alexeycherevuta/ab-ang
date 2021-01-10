import {
    AfterContentInit,
    Component, ElementRef, forwardRef, ViewChild,
} from '@angular/core';
import {
    BaseDropDownListComponent, CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    templateString
} from '@app/main/share/base-ddl.component';
import {MsProjectServiceProxy} from '@shared/service-proxies/service-proxies';
@Component({
    template: templateString,
    selector: 'project-ddl-coba',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, BaseDropDownListComponent]
})
export class ProjectDDLCobaComponent extends BaseDropDownListComponent implements AfterContentInit {
    @ViewChild('dropdownElement', {read: ElementRef}) el;
    listResult = this._msProjectService.getAllMsProject();
    labelField = 'projectName';
    valueField = ['id', 'projectName'];
    isLoading = true;
    constructor(
        private _msProjectService: MsProjectServiceProxy,
    ) {
        super();
    }
    ngAfterContentInit() {
        this.setDropdownElement(this.el);
    }
    retrieveByInput() {
        this.listResult = this._msProjectService.getAllMsProject();
    }
}
