import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { InputPointPctDto } from 'shared/service-proxies/service-proxies';
class Person {
  constructor(firstName: string, lastName: string) {
    this.firstName = firstName,
    this.lastName = lastName
  }
  firstName: string
  lastName: string
}
class Country {
  constructor(countryName: string, countryCode: string) {
    this.countryCode = countryCode,
    this.countryName = countryName
  }
  countryName: string
  countryCode: string
}
@Component({
  selector: 'app-multi-datatable-one-page',
  templateUrl: './multi-datatable-one-page.component.html',
  styleUrls: ['./multi-datatable-one-page.component.css']
})
export class MultiDatatableOnePageComponent extends AppComponentBase implements OnInit {
  public countryList= [];
  public personList= [];
  constructor(injector: Injector) { 
    super(injector)
    this.countryList = [new Country('Indonesia', 'ID')]
    this.personList = [new Person("Donny", "Assdf"), new Person("Qqwew", "Aaasds")]
  }
  ngOnInit() {
  }
}
