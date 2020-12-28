import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VideoTrialInterceptor implements HttpInterceptor {
  serverUrl = environment.SERVER_URI;
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const url = this.serverUrl + req.url;
    const cloneReq = req.clone({
      url,
    });
    return next.handle(cloneReq);
  }
}
