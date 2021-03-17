import { Component, Inject, OnInit } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
  MsalBroadcastService,
} from '@azure/msal-angular';
import {
  AuthenticationResult,
  EndSessionRequest,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { b2cPolicies } from './b2c-config';
import jwt_decode from 'jwt-decode';

interface IdTokenClaims extends AuthenticationResult {
  idTokenClaims: {
    acr?: string;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  opened = false;

  private readonly _destroying$ = new Subject<void>();
  isIframe = false;
  username = '';
  userRole = '';

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((res) => {
        console.log(res);
      });
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.LOGIN_SUCCESS ||
            msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        const payload: IdTokenClaims = <AuthenticationResult>result.payload;
        console.log(result);
        sessionStorage.setItem('token', payload.idToken);
        this.username = payload.account.name;

        // We need to reject id tokens that were not issued with the default sign-in policy.
        // "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr")
        // To learn more about b2c tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview

        if (payload.idTokenClaims?.acr === b2cPolicies.names.forgotPassword) {
          window.alert(
            'Password has been reset successfully. \nPlease sign-in with your new password.'
          );
          return this.authService.logout();
        } else if (
          payload.idTokenClaims.acr === b2cPolicies.names.editProfile
        ) {
          window.alert(
            'Profile has been updated successfully. \nPlease sign-in again.'
          );
          return this.authService.logout();
        }
        return result;
      });
  }

  logout(): void {
    const endSessionRequest: EndSessionRequest = {
      authority: b2cPolicies.authorities.signUpSignIn.authority,
    };
    sessionStorage.clear();
    this.authService.logout(endSessionRequest).subscribe((res) => {
      console.log('logout success');
    });
  }

  getUserName(): string {
    // return '';
    try {
      const token: any = jwt_decode(sessionStorage.getItem('token'));
      return token.name + ' ' + token.family_name;
    } catch (e) {
      return '';
    }
  }

  getUserRole(): string {
    try {
      const token: any = jwt_decode(sessionStorage.getItem('token'));
      this.userRole = token.extension_role;
      return token.extension_role;
    } catch (e) {
      return '';
    }
  }

  canUplaodVideo(): boolean {
    if (this.userRole === 'admin' || this.userRole === 'uploader') {
      return true;
    }
    return false;
  }

  canAddProcedure(): boolean {
    if (this.userRole === 'admin' || this.userRole === 'scrubber') {
      return true;
    }
    return false;
  }
}
