import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  currentVideoID = '';
  currentTimeObs$ = new BehaviorSubject<any>({ time: '', videoPlayerTime: '' });
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

  toTimeFormat(secs: string): string {
    // tslint:disable-next-line: variable-name
    const sec_num = parseInt(secs, 10);
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor(sec_num / 60) % 60;
    const seconds = sec_num % 60;

    const time = [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');

    return time;
  }
}
