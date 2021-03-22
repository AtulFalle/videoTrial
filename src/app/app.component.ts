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
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

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
  idleState: string;
  lastPing: Date;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private idle: Idle,
    private keepalive: Keepalive
  ) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    // idle.setIdle(5);
    // // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    // idle.setTimeout(5);
    // // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    // idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    // idle.onIdleEnd.subscribe(() => (this.idleState = 'No longer idle.'));
    // idle.onTimeout.subscribe(() => {
    //   this.idleState = 'Timed out!';
    //   //  this.timedOut = true;
    //   this.logout();
    // });
    // idle.onIdleStart.subscribe(() => (this.idleState = 'You\'ve gone idle!'));
    // idle.onTimeoutWarning.subscribe(
    //   (countdown: string) =>
    //     (this.idleState = 'You will time out in ' + countdown + ' seconds!')
    // );
    // // sets the ping interval to 15 seconds
    // keepalive.interval(15);
    // keepalive.onPing.subscribe(() => (this.lastPing = new Date()));
    // this.reset();
  }

  // reset(): void {
  //   this.idle.watch();
  //   this.idleState = 'Started.';
  // }

  ngOnInit(): void {
    localStorage.clear();
    this.isIframe = window !== window.parent && !window.opener;

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      // tslint:disable-next-line: deprecation
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
      // tslint:disable-next-line: deprecation
      .subscribe((result: EventMessage) => {
        const payload: IdTokenClaims = result.payload as AuthenticationResult;
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
    // tslint:disable-next-line: deprecation
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
      const roleData = JSON.parse(token.extension_selectedrole);
      const userRoles = [];
      for (const iterator of Object.keys(roleData)) {
        for (const iter of roleData[iterator]) {
          userRoles.push(iter.role);
        }
      }
      if (userRoles.find((e) => e === 'Admin')) {
        this.userRole = 'admin';
        return this.userRole;
      } else if (userRoles.find((e) => e === 'Uploader')) {
        this.userRole = 'uploader';
        return this.userRole;
      } else {
        this.userRole = 'viewer';

        return 'viewer';
      }
    } catch (e) {
      return 'viewer';
    }
  }

  canUplaodVideo(): boolean {
    if (this.userRole.toLowerCase() === 'admin' || this.userRole.toLowerCase() === 'uploader') {
      return true;
    }
    return false;
  }

  canAddProcedure(): boolean {
    if (this.userRole.toLowerCase() === 'admin' || this.userRole.toLowerCase() === 'viewer') {
      return true;
    }
    return false;
  }
}
