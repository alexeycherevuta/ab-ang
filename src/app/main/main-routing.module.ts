import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    {
                        path: 'rnd',
                        loadChildren: 'app/main/rnd/rnd.module#RnDModule',
                        data: { preload: true } 
                    },
                ]
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
