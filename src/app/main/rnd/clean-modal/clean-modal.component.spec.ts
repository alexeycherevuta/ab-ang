import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CleanModalComponent } from './clean-modal.component';
describe('CleanModalComponent', () => {
  let component: CleanModalComponent;
  let fixture: ComponentFixture<CleanModalComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleanModalComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(CleanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
