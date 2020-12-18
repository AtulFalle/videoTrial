import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  currentVideoID = '';
  currentTimeObs$ = new BehaviorSubject<any>({time: '', videoPlayerTime: ''});
  pauseVideoObs$ = new BehaviorSubject<boolean>(false);
  jumpToAnnotaion = new BehaviorSubject<string>('');

  get jumpToAnnotationTime(): Observable<string> {
    return this.jumpToAnnotaion.asObservable();
  }

  get videoStatus(): Observable<boolean> {
    return this.pauseVideoObs$.asObservable();
  }

  get currentTime(): Observable<string> {
    return this.currentTimeObs$.asObservable();
  }
  constructor() {}
}
