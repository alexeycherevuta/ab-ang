import { Component, OnInit, ViewChild, Output, EventEmitter, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import * as _ from 'lodash';
import { AppComponentBase, ModalProperty } from 'shared/common/app-component-base';
import { FormGroup,FormBuilder,Validators } from "@angular/forms";
import { FormControl } from '@angular/forms/src/model';
@Component({
  selector: 'cleanModalModal',
  templateUrl: './clean-modal-modal.component.html'
})
export class CleanModalModalComponent extends AppComponentBase implements OnInit {
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal: ModalDirective;
  @ViewChild('cleanModalModal') cleanModalModal: ModalDirective;
  active = true;
  saving = false;
  props: ModalProperty;
  accountForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  address: FormControl;
  constructor(
    injector: Injector,
    private _fb: FormBuilder,
  ) { 
    super(injector)
    this.accountForm = _fb.group({
      'firstName': [null,Validators.compose([Validators.required,Validators.maxLength(5)])],
      'lastName': [null,Validators.compose([Validators.required,Validators.maxLength(50)])],
      'address': [null,Validators.compose([Validators.required,Validators.maxLength(50)])],      
    })
    this.props = new ModalProperty();
  }
  ngOnInit() {
  }
  show() {
    this.props.edit = false;
    this.cleanModalModal.show();
  }
  save() {
    console.log(this.accountForm.value);
  }
  close() {
    this.accountForm.reset();
    this.cleanModalModal.hide();
  }
}
