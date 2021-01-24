import { Injectable } from '@angular/core';
import { AppMenuItem } from './app-menu-item';
import { AppMenu } from './app-menu';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
@Injectable()
export class AppNavigationService {
    constructor(private _permissionService: PermissionCheckerService) {
    }
    getMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [
            new AppMenuItem('Dashboard', 'Pages.Administration.Host.Dashboard', 'flaticon-line-graph', '/app/admin/hostDashboard'),
            new AppMenuItem('Dashboard', 'Pages.Tenant.Dashboard', 'flaticon-line-graph', '/app/main/dashboard'),
            new AppMenuItem('Tenants', 'Pages.Tenants', 'flaticon-list-3', '/app/admin/tenants'),
            new AppMenuItem('Editions', 'Pages.Editions', 'flaticon-app', '/app/admin/editions'),
            new AppMenuItem('Administration', '', 'flaticon-interface-8', '', [
                new AppMenuItem('OrganizationUnits', 'Pages.Administration.OrganizationUnits', 'flaticon-map', '/app/admin/organization-units'),
                new AppMenuItem('Roles', 'Pages.Administration.Roles', 'flaticon-suitcase', '/app/admin/roles'),
                new AppMenuItem('Users', 'Pages.Administration.Users', 'flaticon-users', '/app/admin/users'),
                new AppMenuItem('Languages', 'Pages.Administration.Languages', 'flaticon-tabs', '/app/admin/languages'),
                new AppMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', 'flaticon-folder-1', '/app/admin/auditLogs'),
                new AppMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', 'flaticon-lock', '/app/admin/maintenance'),
                new AppMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement', 'flaticon-refresh', '/app/admin/subscription-management'),
                new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', 'flaticon-medical', '/app/admin/ui-customization'),
                new AppMenuItem('Settings', 'Pages.Administration.Host.Settings', 'flaticon-settings', '/app/admin/hostSettings'),
                new AppMenuItem('Settings', 'Pages.Administration.Tenant.Settings', 'flaticon-settings', '/app/admin/tenantSettings')
            ]),
            new AppMenuItem('RnD', '', 'flaticon-line-graph', '', [
                new AppMenuItem('MultipleData', '', 'flaticon-line-graph', '/app/main/rnd/multiple-data'),
                new AppMenuItem('GetParamUrl', '', 'flaticon-line-graph', '/app/main/rnd/getparam-url'),
                new AppMenuItem('GetDataFromModal', '', 'flaticon-line-graph', '/app/main/rnd/get-data-from-modal'),
                new AppMenuItem('FormDatePicker', '', 'flaticon-line-graph', '/app/main/rnd/form-date-picker'),
                new AppMenuItem('ClearModal', '', 'flaticon-line-graph', '/app/main/rnd/clean-modal'),
                new AppMenuItem('InputMask', '', 'flaticon-line-graph', '/app/main/rnd/input-mask'),
                new AppMenuItem('FormControl', '', 'flaticon-line-graph', '/app/main/rnd/form-control'),
                new AppMenuItem('UploadFile', '', 'flaticon-line-graph', '/app/main/rnd/upload-file'),
            ]),
            new AppMenuItem('DemoUiComponents', 'Pages.DemoUiComponents', 'flaticon-shapes', '/app/admin/demo-ui-components')
        ]);
    }
    checkChildMenuItemPermission(menuItem): boolean {
        for (let i = 0; i < menuItem.items.length; i++) {
            let subMenuItem = menuItem.items[i];
            if (subMenuItem.permissionName && this._permissionService.isGranted(subMenuItem.permissionName)) {
                return true;
            }
            if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            } else if (!subMenuItem.permissionName) {
                return true;
            }
        }
        return false;
    }
}
