import { Component, Injector, ViewChild} from '@angular/core';
import { AppComponentBase } from "@shared/common/app-component-base";
import { appModuleAnimation } from 'shared/animations/routerTransition';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Observable } from 'rxjs/Observable';
import { List } from 'lodash';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
@Component({
    templateUrl: './currency-format-view.component.html',
    animations: [appModuleAnimation()]
})
export class CurrencyFormatViewComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable') dataTable: DataTable;
    first: 0;
    data: any;
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
    ngOnInit(): void {
        this.getLatestList();
    }
    initData(): any{    
        let result = {"items":[
            {"id": 1, "positionName": "Owner", "positionCode": "OWR", "royalty": 2000000, "isActive": true},
            {"id": 2, "positionName": "General Manager", "positionCode": "GM", "royalty": 1500000, "isActive": true},
            {"id": 3, "positionName": "Deputy General Manager", "positionCode": "DGM", "royalty": 1390000, "isActive": true},
            {"id": 4, "positionName": "Manager", "positionCode": "MGR", "royalty": 1200000, "isActive": true},
            {"id": 5, "positionName": "Human Resource Manager", "positionCode": "HRM", "royalty": 1000000, "isActive": true},
            {"id": 6, "positionName": "Staff", "positionCode": "STF", "royalty": 500000, "isActive": true}
        ]};
        return result;
    }
    getLatestList(event?): void {
        if (event) {
            this.first = event.first;
        } else {
            this.primengDatatableHelper.showLoadingIndicator();
            this.first = 0;
            this.data = this.initData();
            this.primengDatatableHelper.records = this.data.items;
            this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
            this.primengDatatableHelper.totalRecordsCount = this.data.items.length;
            this.primengDatatableHelper.hideLoadingIndicator();
        }
    }
}
