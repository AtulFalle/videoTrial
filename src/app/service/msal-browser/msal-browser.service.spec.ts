import { TestBed } from '@angular/core/testing';

import { MsalBrowserService } from './msal-browser.service';

describe('MsalBrowserService', () => {
  let service: MsalBrowserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsalBrowserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
