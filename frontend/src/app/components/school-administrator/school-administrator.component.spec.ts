import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolAdministratorComponent } from './school-administrator.component';

describe('SchoolAdministratorComponent', () => {
  let component: SchoolAdministratorComponent;
  let fixture: ComponentFixture<SchoolAdministratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolAdministratorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});