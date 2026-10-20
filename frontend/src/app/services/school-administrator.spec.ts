import { TestBed } from '@angular/core/testing';

import { SchoolAdministrator } from './school-administrator';

describe('SchoolAdministrator', () => {
  let service: SchoolAdministrator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolAdministrator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
