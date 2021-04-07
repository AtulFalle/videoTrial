import { MsalBrowserService } from './../../service/msal-browser/msal-browser.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import {  Observable } from 'rxjs';
import {
  catchError,
  switchMap,
  take
} from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private msalService: MsalBrowserService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const apiRefresh = 'https://biogenb2cnonprod.b2clogin.com';
    if (req.url.includes(apiRefresh)) {
      return next.handle(req);
    }
    const currentToken = sessionStorage.getItem('token');

    const headers = req.headers
      .append('Access-Control-Allow-Origin', '*');
    if (req.url.includes('assets')) {
      const cloneUrl = req.url.startsWith('assets') || req.url.includes('http')
        ? req.url
        : environment.SERVER_URI + req.url;
      const cloneReq = req.clone({ headers, url: cloneUrl });
      return next.handle(cloneReq);
    }

    if (this.checkIfTokenRefreshisRequired(currentToken)) {
      return this.refreshToken(req, next);
    } else {
      return this.handleRequestHeaders(req, next, currentToken);
    }
  }

  refreshToken(req: HttpRequest<any>, next: HttpHandler): any {
    return this.msalService.refreshToken().pipe(
      take(1),
      switchMap((token) => {
        sessionStorage.setItem('token', token.idToken);
        return this.handleRequestHeaders(req, next, token.idToken);
      }),
      catchError((e) => {
        const token = sessionStorage.getItem('token');
        return this.handleRequestHeaders(req, next, token);
      })
    );
  }

  checkIfTokenRefreshisRequired(currentToken: string): boolean {
    try {
      const decode: any = jwt_decode(currentToken);
      const lifetime = +decode.exp;
      const difference = lifetime - new Date().getTime() / 1000;
      if (difference <= environment.refreshCheckInterval) {
        return true;
      }
      return false;
    } catch (e) {
      return true;
    }
  }

  handleRequestHeaders(
    req: HttpRequest<any>,
    next: HttpHandler,
    userToken: string
  ): Observable<HttpEvent<any>> {
    const headers = req.headers
      .append('Access-Control-Allow-Origin', '*')
      .append('Content-Type', 'application/json');

    const cloneUrl =
      req.url.startsWith('assets') || req.url.includes('http')
        ? req.url
        : environment.SERVER_URI + req.url;

    const altHeadersWithToken = req.headers
      .set('Authorization', 'Bearer ' + userToken);

    const authReq = req.clone({
      headers: altHeadersWithToken,
      url: cloneUrl,
    });
    return next.handle(authReq);
  }
}
