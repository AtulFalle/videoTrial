import { Observable } from 'rxjs';
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
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // const url = this.serverUrl + req.url;
    const url =  req.url;
    const cloneReq = req.clone({
      url,
    });
    return next.handle(cloneReq);
  }
}
