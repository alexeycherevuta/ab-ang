import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiDatatableOnePageComponent } from './multi-datatable-one-page.component';
describe('MultiDatatableOnePageComponent', () => {
  let component: MultiDatatableOnePageComponent;
  let fixture: ComponentFixture<MultiDatatableOnePageComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiDatatableOnePageComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDatatableOnePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
