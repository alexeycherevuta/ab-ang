import { AppComponentBase } from 'shared/common/app-component-base';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, Injector } from '@angular/core';
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./input-mask.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class InputMaskComponent extends AppComponentBase implements OnInit {
    customDateVar: any;
    active: boolean;
    inputMasks: any[];
    private input: MSInputDto;
    constructor(
      injector: Injector,
    ) {
      super(injector)
      this.active = true
      this.inputMasks = []
    }
    ngOnInit() {
      this.input = new MSInputDto(); 
      for(let i = 1 ; i <= 8 ; i++) {
        this.inputMasks.push(eval("this.getInputMask"+i+"()"));
      }
    }
    save() {
      console.log(this.input);
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
}
class MSInputDto {
  customDate: any;
  customPlaceholder: any;
  phoneNumber: any;
  exptyPlaceholder: any;
  repeatingMask: any;
  rightAlign: any;
  currency: any;
  separatorAngka: any;
  ipAddress: any;
  emailAddress: any;
}
