import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MsalBrowserService {
  constructor(private authService: MsalService) {}

  login(userFlowRequest?: RedirectRequest | PopupRequest): Observable<void> {
    return this.authService.loginRedirect();
  }

}
