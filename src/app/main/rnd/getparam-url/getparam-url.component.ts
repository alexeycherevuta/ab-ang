import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Router } from '@angular/router';
@Component({
    templateUrl: './getparam-url.component.html',
    animations: [appModuleAnimation()]
})
export class GetParamUrlComponent extends AppComponentBase {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    constructor(
        injector: Injector,
        private router: Router,
    ) {
        super(injector);
    }
    getData(event?: LazyLoadEvent): void {
        this.primengDatatableHelper.showLoadingIndicator();
        setTimeout(() => { 
            let result = {
                items: [
                    { scmProjCode: '4', scmProjName: 'Lippo', Project: 'Meikarta', Active: 'Active' },
                    { scmProjCode: '8', scmProjName: 'Genev', Project: 'Genesiwa', Active: 'Inactive' }
                ]
            };
            this.primengDatatableHelper.records = result.items;
            this.primengDatatableHelper.totalRecordsCount = result.items.length;
            this.primengDatatableHelper.hideLoadingIndicator();
        }, 0);
    }
    gotoDetail(paramID: number): void {
        this.router.navigate(['app/main/rnd/getparam-url/detail', paramID]);
    }
}
