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
  id: string,
  objectId: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
  studies: any[] = [
    { value: 'All', viewValue: 'All' }
  ];
  sites: any[] = [
    { value: 'All', study: "All", viewValue: 'All' }
  ];
  displayedColumns: string[] = ["firstName", "lastName", "emailId", "role", "study", "site","status", "action"];
  siteList: any[];
  studiesList: any[];
  approvalUserList: UserApproval[] = [];
  existingUserList: UserApproval[] = [];
  userList: User[] = [];
  roles: any;
  selectedSudy: string = 'All';
  selectedSite: string = 'All';
  selectedIndex: number = -1;
  constructor(
    private store$: Store<VideoTrialStoreState.State>,
  ) { }

  ngOnInit(): void {
    this.store$.dispatch(VideoTrialStoreActions.getAllUser());
    this.store$.dispatch(VideoTrialStoreActions.getAllRole());
    this.store$.select(VideoTrialStoreSelectors.getAllRoles).subscribe((roles) => {

      this.roles = roles;
      if (roles.Studies) {
        console.log(roles.Studies);
        this.studies = [{ value: 'All', viewValue: 'All' }];
        this.sites = [{ value: 'All', study: "All", viewValue: 'All' } ];
        console.log(Object.keys(roles.Studies));
        Object.keys(roles.Studies).map(study => {
          this.studies.push({ value: study, viewValue: study });
          roles.Studies[study].map((site: any) => {
            this.sites.push({ value: site, study: study, viewValue: site })
          })
        })

      }
    });

    this.store$.select(VideoTrialStoreSelectors.getAllUsers).subscribe((res) => {
      this.approvalUserList = [];
      this.existingUserList = [];
      this.userList = res;
      console.log(this.userList);
      res.map(user => {
        if (user.selectedRole) {
          Object.keys(user.selectedRole).map(study => {
            user.selectedRole[study].map((roleObj: any) => {
              let tempUser = {
                firstName: user.givenName,
                lastName: user.surname,
                emailId: user.email,
                role: roleObj.role,
                study: study,
                site: roleObj.site,
                siteRequestStatus: roleObj.siteRequestStatus,
                id: roleObj.id,
                objectId: user.objectId
              }
              if (roleObj.siteRequestStatus == "requested") {
                this.approvalUserList.push(tempUser)
              } else {
                this.existingUserList.push(tempUser)
              }
            })

          })
        }
      });

    });
  }

  updateUserStatus(id: string, status: string, objectId: string) {
    this.selectedIndex = -1;
    const index = this.userList.findIndex((ele) => ele.objectId === objectId);
    let tempSelectedRole: any = {};
    if (this.userList[index].selectedRole) {

      Object.keys(this.userList[index].selectedRole).map(study => {
        let roleObjArr: any[] = [];
        this.userList[index].selectedRole[study].map((roleObj: any) => {
          if (roleObj.id == id) {
            roleObjArr.push({
              id: id,
              role: roleObj.role,
              site: roleObj.site,
              siteRequestStatus: status
            });
          } else {
            roleObjArr.push(roleObj);
          }

        })
        tempSelectedRole[study] = roleObjArr;
      })
    }
    this.store$.dispatch(
      VideoTrialStoreActions.updateUserStatusAdmin({ objectId: objectId, selectedRole: tempSelectedRole })
    );

  }
  onStudySelect = () => {
    this.selectedSite = 'All';
  }
  getSite = () => {
    if(this.selectedSudy == 'All') {
      return this.sites;
    } else {
      return this.sites.filter(site=> site.study == 'All' || site.study == this.selectedSudy)
    }
  }
   getUsers = () => {
    if (this.selectedSudy == 'All' && this.selectedSite == 'All') {
      return this.approvalUserList;
    } else if(this.selectedSudy !== 'All' && this.selectedSite == 'All') {
       return this.approvalUserList.filter(user=> user.study == this.selectedSudy)
    } else if(this.selectedSudy == 'All' && this.selectedSite !== 'All') {
      return this.approvalUserList.filter(user=> user.site == this.selectedSite)
   } else{
      return this.approvalUserList.filter(user=> user.study == this.selectedSudy && user.site == this.selectedSite)
    }
  }
  getExistingUsers = () => {
    if (this.selectedSudy == 'All' && this.selectedSite == 'All') {
      return this.existingUserList;
    } else if(this.selectedSudy !== 'All' && this.selectedSite == 'All') {
       return this.existingUserList.filter(user=> user.study == this.selectedSudy)
    } else if(this.selectedSudy == 'All' && this.selectedSite !== 'All') {
      return this.existingUserList.filter(user=> user.site == this.selectedSite)
   } else{
      return this.existingUserList.filter(user=> user.study == this.selectedSudy && user.site == this.selectedSite)
    }
  }
  onRowClick = (index: number) => {
    this.selectedIndex = index;
  }
  resetSelection = () => {
    this.selectedIndex = -1;
  }
}
