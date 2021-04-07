import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MsalBrowserService {
  constructor(private authService: MsalService, private http: HttpClient) {}

  login(userFlowRequest?: RedirectRequest | PopupRequest): Observable<void> {
    return this.authService.loginRedirect();
  }


  refreshToken(): Observable<any> {

    const url = 'https://biogenb2cnonprod.b2clogin.com/biogenb2cnonprod.onmicrosoft.com/b2c_1a_signup_signin/oauth2/v2.0/token';
    const body = new FormData();
    body.set('client_id', 'a39f9378-d595-42ad-b773-422b79502a9c');
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', this.getSecrete());
    return this.http.post(url, body);

  }

  getSecrete(): string {

    const objectList: any[] = [];
    Object.values(sessionStorage).forEach( (key) => {
      try{
        objectList.push(JSON.parse(key))
      }
    });

    const keyObject = objectList.find(
      (key) => key.credentialType === 'RefreshToken'
    );

    return keyObject.secret || ''

  }

}
