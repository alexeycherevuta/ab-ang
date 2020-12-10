import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
@Component({
  selector: 'app-clean-modal',
  templateUrl: './clean-modal.component.html'
})
export class CleanModalComponent extends AppComponentBase implements OnInit {
  constructor(injector: Injector) { 
    super(injector)
  }
  ngOnInit() {
  }
}
