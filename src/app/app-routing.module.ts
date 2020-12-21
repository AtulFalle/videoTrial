import { HomeComponent } from './componants/home/home.component';
import { VideoListComponent } from './componants/video-list/video-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoPlayerComponent } from './componants/video-player/video-player.component';

const routes: Routes = [
  {
    path: 'video-upload',
    component: VideoPlayerComponent,
  },
  {
    path: 'videoList',
    component: VideoListComponent,
  },
  {
    path: 'add-video',
    component: HomeComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
