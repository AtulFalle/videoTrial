import { HomeComponent } from './components/home/home.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { AddProcedureComponent } from './components/add-procedure/add-procedure.component';

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
    path: 'procedure-details/:id',
    component: HomeComponent,
  },
  {
    path: 'add-procedure',
    component: AddProcedureComponent,
  },
  {
    path: '',
    component: VideoListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
