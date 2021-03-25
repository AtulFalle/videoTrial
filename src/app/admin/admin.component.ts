import { updateUserStatusAdmin } from './../root-store/video-trial-store/actions';
import { Role, User } from './../core/models/admin.model';
import { AdminService } from './admin.service';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { VideoTrialStoreActions, VideoTrialStoreSelectors, VideoTrialStoreState } from '../root-store/video-trial-store';
export interface UserApproval {
  firstName: string;
  lastName: string;
  emailId: string;
  role: string;
  study: string;
  site: string;
  siteRequestStatus: string;
  id: string;
  objectId: string;
}
// const ELEMENT_DATA: UserApproval[] = [
//   { firstName: 'Steve', lastName: 'Roger', emailId: 'steve@gmail.com', role: 'Admin', study: 'Study A', site: 'Site A' },
//   { firstName: 'John', lastName: 'Smith', emailId: 'john@gmail.com', role: 'User', study: 'Study B', site: 'Site C' },
//   { firstName: 'Alex', lastName: '', emailId: 'laex@gmail.com', role: 'Admin', study: 'Study C', site: 'Site A' }
// ];
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
  studies: any[] = [
    { value: 'Study A', viewValue: 'Study A' },
    { value: 'Study B', viewValue: 'Study B' },
    { value: 'Study C', viewValue: 'Study c' }
  ];
  sites: any[] = [
    { value: 'Site A', viewValue: 'Site A' },
    { value: 'Site B', viewValue: 'Site B' },
    { value: 'Site C', viewValue: 'Site c' }
  ];
  displayedColumns: string[] = ['firstName', 'lastName', 'emailId', 'role', 'study', 'site', 'action'];
  siteList: any[];
  studiesList: any[];
  approvalUserList: UserApproval[] = [];
  userList: User[] = [];
  constructor(
    private adminService: AdminService,
    private store$: Store<VideoTrialStoreState.State>,
  ) { }

  ngOnInit(): void {
    this.store$.dispatch(VideoTrialStoreActions.getAllUser());
    this.store$.select(VideoTrialStoreSelectors.getAllUsers).subscribe((res) => {
      this.approvalUserList = [];
      this.userList = res;
      console.log(res);
      res.map(user => {
        if (user.selectedRole) {
          Object.keys(user.selectedRole).map(study => {
            console.log(user.selectedRole[study]);
            user.selectedRole[study].map((roleObj: any) => {
              if (roleObj.siteRequestStatus == 'requested') {
                this.approvalUserList.push({
                  firstName: user.givenName,
                  lastName: user.surname,
                  emailId: user.email,
                  role: roleObj.role,
                  study,
                  site: roleObj.site,
                  siteRequestStatus: roleObj.siteRequestStatus,
                  id: roleObj.id,
                  objectId: user.objectId
                });
              }
            });

          });
        }
      });

      console.log(this.approvalUserList);

    });
  }

  updateUserStatus(id: string, status: string, objectId: string) {



    const index = this.userList.findIndex((ele) => ele.objectId === objectId);
    const tempSelectedRole: any = {};
    if (this.userList[index].selectedRole) {

      Object.keys(this.userList[index].selectedRole).map(study => {
        const roleObjArr: any[] = [];
        this.userList[index].selectedRole[study].map((roleObj: any) => {
          if (roleObj.id == id) {
            console.log(roleObj);
            roleObjArr.push({
              id,
              role: roleObj.role,
              site: roleObj.site,
              siteRequestStatus: status
            });
          } else {
            roleObjArr.push(roleObj);
          }

        });
        tempSelectedRole[study] = roleObjArr;
      });
    }
    console.log(tempSelectedRole);
    this.store$.dispatch(
      VideoTrialStoreActions.updateUserStatusAdmin({ objectId, selectedRole: tempSelectedRole })
    );

  }

}
