import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { UserServiceProxy, UserListDto } from '@shared/service-proxies/service-proxies';
@Component({
    templateUrl: './ms-crud.component.html',
    animations: [appModuleAnimation()]
})
export class MsCrudComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    first = 0;
    constructor(
        injector: Injector,
        private _userServiceProxy: UserServiceProxy,
    ) {
        super(injector);
    }
    ngOnInit() {
        this.getLatestList();
    }
    deleteRecord(record: UserListDto): void {
        this.message.confirm(
            this.l('AreYouSureToDelete') + ' ' + this.l('User').toLowerCase() + ' ' + record.userName,
            isConfirmed => {
                if (isConfirmed) {
                    this._userServiceProxy.deleteUser(record.id)
                    .subscribe(() => {
                        this.getLatestList();
                        abp.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }
    getLatestList(event?): void {
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this._userServiceProxy.getUsers(undefined, undefined, undefined, undefined, 100, 0)
            .finally(() => {
                this.primengDatatableHelper.hideLoadingIndicator();
            })
            .subscribe(result => {
                this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                this.primengDatatableHelper.totalRecordsCount = result.items.length;
                this.primengDatatableHelper.records = result.items;
            });
        }
    }
}
