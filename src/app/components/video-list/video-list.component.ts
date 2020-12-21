import { TrialVideo } from './../../core/models/annotations.model';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  VideoTrialStoreSelectors,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
})
export class VideoListComponent implements OnInit {
  videoList!: Observable<TrialVideo[]>;

  constructor(
    private store$: Store<VideoTrialStoreState.State>,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.videoList = this.store$.select(VideoTrialStoreSelectors.getVideoList);
  }

  getUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  addVideo(): void {
    this.router.navigate(['/add-video']);
  }
}
