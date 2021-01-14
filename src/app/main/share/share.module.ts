import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from '@node_modules/angular2-counto';
import { EasyPieChartModule } from 'ng2modules-easypiechart';
import { SpinnerModule, EditorModule, DropdownModule, ButtonModule } from 'primeng/primeng';
import { InputMaskDirective } from "@app/main/share/input-mask.directive";
import { FormControlStyleComponent } from "@app/main/share/form-control-style.component";
import { ControlMessageComponent } from "@app/main/share/control-message.component";
import { CurrencyMaskModule } from "@app/main/share/ng2-currency-mask/currency-mask.module";
import { CurrencyMaskDirective } from "@app/main/share/ng2-currency-mask/currency-mask.directive";
import { PriceFormatDirective } from "@app/main/share/price-format.directive";
import { TrimValueAccessor } from "@app/main/share/trim-value-accessor.directive";
import { UploadFileDirective } from "@app/main/share/upload-file.directive";
import { ExampleDdlComponent } from "@app/main/share/rnd/example-ddl.component";
@NgModule({
        imports: [
                CommonModule,
                FormsModule, ReactiveFormsModule,
                ModalModule, TabsModule, TooltipModule,
                AppCommonModule,
                UtilsModule,
                CountoModule,
                EasyPieChartModule,
                SpinnerModule, EditorModule, DropdownModule, ButtonModule,
                CurrencyMaskModule
        ],
        declarations: [
                InputMaskDirective,
                PriceFormatDirective,
                TrimValueAccessor,
                UploadFileDirective,
                FormControlStyleComponent,
                ControlMessageComponent,
                ExampleDdlComponent,
        ],
        exports: [
                InputMaskDirective,
                CurrencyMaskDirective,
                PriceFormatDirective,
                TrimValueAccessor,
                UploadFileDirective,
                FormControlStyleComponent,
                ControlMessageComponent,
                ExampleDdlComponent,
        ]
})
export class ShareModule { }
