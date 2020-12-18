import { BehaviorSubject } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('stepper', { static: true }) stepper!: MatStepper;
  videoId!: string;
  showVideoPlayer = false;

  private _jumpLocation = new BehaviorSubject<number>(0);

  jumpLocation = this._jumpLocation.asObservable();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  redirectToHome(): void {
    this.router.navigate(['/videoList']);
  }

  goToNext(videoId: string): void {
    this.videoId = videoId;
    this.stepper.next();
    this.showVideoPlayer = true;
  }

  resetPlayer(): void {
    this.showVideoPlayer = false;
  }

  annotationAdded(): void {
    // this.stepper.next();
    this.stepper.reset();
    this.redirectToHome();
  }

  skipVideoToTime(time: number): void {
    this._jumpLocation.next(time);
  }
}
