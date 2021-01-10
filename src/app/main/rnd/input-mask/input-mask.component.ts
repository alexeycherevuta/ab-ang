import { AppComponentBase } from 'shared/common/app-component-base';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./input-mask.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class InputMaskComponent extends AppComponentBase implements OnInit, AfterViewInit {
    editForm: FormGroup;
    active: boolean;
    customDate: FormControl;
    customPlaceholder: FormControl;
    phoneNumber: FormControl;
    exptyPlaceholder: FormControl;
    repeatingMask: FormControl;
    rightAlign: FormControl;
    currency: FormControl;
    ipAddress: FormControl;
    emailAddress: FormControl;
    inputMasks: any[];
    constructor(
      injector: Injector,
      private _fb: FormBuilder,
    ) {
      super(injector)
      this.editForm = _fb.group({
        'customDate': [null],
        'customPlaceholder': [null],
        'phoneNumber': [null],
        'exptyPlaceholder': [null],
        'repeatingMask': [null],
        'rightAlign': [null],
        'currency': [null],
        'ipAddress': [null],
        'emailAddress': [null],
          'decimal': [null],
      })
      this.active = true
      this.inputMasks = []
    }
    ngOnInit() {
      for(let i = 1 ; i <= 9 ; i++) {
        this.inputMasks.push(eval("this.getInputMask"+i+"()"));
      }
    }
    ngAfterViewInit() {
    }
    save() {
        console.log(this.editForm.value);
    }
    getInputMask1() {
      return {"placeholder": "*"};
    }
    getInputMask2() {
      return  {
        "mask": "(999) 999-9999"
      };
    }
    getInputMask3() {
      return {
        "mask": "99-9999999",
        placeholder: "" 
      }
    }
    getInputMask4() {
      return {
        "mask": "9",
        "repeat": 10,
        "greedy": false
      }
    }
    getInputMask5() {
      return  {
        rightAlignNumerics: false
      }
    }
    getInputMask6() {
      return  {
        numericInput: true
      }
    }
    getInputMask7() {
      return {
        "mask": "999.999.999.999"
      }
    }
    getInputMask8() {
      return {
        mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
        greedy: false,
        onBeforePaste: function (pastedValue, opts) {
            pastedValue = pastedValue.toLowerCase();
            return pastedValue.replace("mailto:", "");
        },
        definitions: {
            '*': {
                validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
                cardinality: 1,
                casing: "lower"
            }
        }
      }
    }
    getInputMask9() {
        return { 'alias': 'decimal', 'groupSeparator': ',', 'autoGroup': true, 'digits': 2, 'digitsOptional': false,
            'placeholder': '0.00', rightAlign : true, clearMaskOnLostFocus: !1, 'autoUnmask': true, 'removeMaskOnSubmit': true};
    }
}
