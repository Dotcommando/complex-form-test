import { TestBed, async, inject } from '@angular/core/testing';

import { SubmittedOnlyGuard } from './submitted-only.guard';

describe('SubmittedOnlyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubmittedOnlyGuard]
    });
  });

  it('should ...', inject([SubmittedOnlyGuard], (guard: SubmittedOnlyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
