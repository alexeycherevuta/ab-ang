import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    templateUrl: './getparam-url-detail.component.html',
    animations: [appModuleAnimation()]
})
export class GetParamUrlDetailComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable') dataTable: DataTable;
    dataID = {};
    constructor(
        injector: Injector,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        super(injector);
    }
    ngOnInit(): void {
        let idSnapshotKey = this.route.snapshot.paramMap.keys[0];
        let idSnapshot = this.route.snapshot.paramMap.get(idSnapshotKey);
        setTimeout(() => { 
            let result = { paramSnapshotKey: idSnapshotKey, paramSnapshot: idSnapshot };
            this.dataID = result;
        }, 0);
    }
    backToReturn(): void {
        this.router.navigate(['app/main/rnd/getparamUrl']);
    }
}
