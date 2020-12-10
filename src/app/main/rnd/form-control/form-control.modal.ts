import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { CreateMsAccountInput, ICreateMsAccountInput, MsAccountServiceProxy, GetMsCompanyDropDownListDto, GetTypeBankDropDownListDto, GetBankBranchListDto, GetProjectDropdownListDto, GetBankDropDownListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FormGroup,FormBuilder,Validators } from "@angular/forms";
import * as _ from 'lodash';
export class dataAccountCtrl {
    projectID: any
    accName: any
    accNo: any
    accCode: any
    companyID: any
    bankBranchID: any
    bankID: any
    isActive: any
}  
export class modal_property{
    edit:boolean
    id:number
    nama:string
}
@Component({
    selector: 'formControlModal',
    templateUrl: './form-control.modal.html'
})
export class FormControlModalComponent extends AppComponentBase {
    @ViewChild('formControlModal') formControlModal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() modalHide: EventEmitter<any> = new EventEmitter<any>();
    model:dataAccountCtrl = new dataAccountCtrl
    model_ctrl:dataAccountCtrl = new dataAccountCtrl;
    accountForm:FormGroup;
    selectedCompany:any;
    selectedBank:any;
    selectedProject:any;
    selectedBranchByBankOut:any;
    untukUpdate: any;
    dari_tabel: any;
    selectedBranch: any;
    active = false;
    saving = false;
    modal_property:modal_property = new modal_property
    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        private _msAccountServiceProxy: MsAccountServiceProxy
    ) {
        super(injector);
        this.accountForm = _fb.group({
            'accCode': [null,Validators.compose([Validators.required,Validators.maxLength(5)])],
            'accName': [null,Validators.compose([Validators.required,Validators.maxLength(50)])],
            'accNo': [null,Validators.compose([Validators.required,Validators.maxLength(50)])],
            'bankID': [null,Validators.compose([Validators.required,Validators.maxLength(50)])]            
        })
        this.model_ctrl = this.r_control()
    }
    ngOninit(){
        console.log(this.selectedProject)
    }
    r_control(){
        return {
            projectID:this.accountForm.controls['projectID'],
            accName:this.accountForm.controls['accName'],
            accNo:this.accountForm.controls['accNo'],
            accCode:this.accountForm.controls['accCode'],
            companyID:this.accountForm.controls['companyID'],
            bankBranchID:this.accountForm.controls['bankBranchID'],
            bankID:this.accountForm.controls['bankID'],
            isActive:this.accountForm.controls['isActive'],
        }
    }
    show(id?:number,nama?:string,dari_table?:any){
        this.active = true
        this.formControlModal.show();
        this.modal_property = this.ubahJudul(id,nama)
        if (id){
            this.set_model_from_table(dari_table)
        }
    }
    set_model_from_table(dari_table){
        console.log(dari_table)
        this.model.accCode          = dari_table.accCode
        this.model.accName          = dari_table.accName
        this.model.accNo            = dari_table.accNo
        this.selectedCompany        = dari_table.companyID
        this.selectedBank           = dari_table.bankID
        this.selectedProject        = dari_table.projectID
        this.selectedBranchByBankOut= dari_table.bankID 
        this.selectedBranch         = dari_table.bankBranchID 
    }
    private ubahJudul(id,nama):modal_property{
        if (id){
            return {
                edit:true,
                id:id,
                nama:nama
            }
        }else{
            return {
                edit:false,
                id:0,
                nama:''
            }
        }
    }
    selectByBank(event){
       this.selectedBranchByBankOut = event
    }
    r_combo():boolean{
        return true
    }
    out(event){
        console.log(event);
    }
    set_Insert(){
        console.log(this.selectedBank.bankID)
        this.model.bankBranchID = this.selectedBranchByBankOut
        this.model.bankID       = this.selectedBank
        this.model.projectID    = this.selectedProject
        this.model.companyID    = this.selectedCompany
        this.model.isActive     = true
    }
    simpan(event){
        console.log(this.model)
        if (this.modal_property.edit){
        }else{
        }
    }
    private edit(){
        console.log('edit jalan')
    }
    private create(event){
        console.log('create jalan')
        let a = this.r_combo();
    }
    close(): void {
        this.active = false;
        this.formControlModal.hide();
        this.modalHide.emit();
    }
    formPrint(): void {
        console.log(this.model_ctrl);
    }
}
