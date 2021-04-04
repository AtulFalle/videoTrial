import { NotAuthorizedComponent } from './authentication/not-authorized/not-authorized.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { AddProcedureComponent } from './components/add-procedure/add-procedure.component';
import { ProceduresListComponent } from './components/procedures-list/procedures-list.component';
import { MsalGuard } from '@azure/msal-angular';
import { FileUploaderComponent } from './shared/file-uploader/file-uploader.component';
import { AuthRoleGuard } from './core/guard/auth-role.guard';

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
    canActivate: [AuthRoleGuard],
  },
  {
    path: 'add-procedure',
    component: AddProcedureComponent,
    canActivate: [AuthRoleGuard],
  },
  {
    path: 'procedures-list',
    component: ProceduresListComponent,
    canActivate: [AuthRoleGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: ProceduresListComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'file-uploader',
    component: FileUploaderComponent
  },
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'admin-user',
    loadChildren: () => import('./admin-user/admin.module').then(m => m.AdminModule)
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
