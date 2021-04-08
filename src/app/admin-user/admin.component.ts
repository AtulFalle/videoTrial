import { updateUserStatusAdmin } from './../root-store/video-trial-store/actions';
import { Role, User } from './../core/models/admin.model';
import { AdminService } from './admin.service';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { VideoTrialStoreActions, VideoTrialStoreSelectors, VideoTrialStoreState } from '../root-store/video-trial-store';
import { animate, state, style, transition, trigger } from '@angular/animations';
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
  styleUrls: ['./admin.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AdminComponent implements OnInit {
  studies: any[] = [
    { value: 'All', viewValue: 'All' }
  ];
  sites: any[] = [
    { value: 'All', study: "All", viewValue: 'All' }
  ];
  displayedColumns: string[] = ["firstName", "lastName", "emailId", "role", "study", "site", "status", "action"];
  requestedUserColumns: string[] = ["firstName", "lastName", "emailId", "status", "action"];
  siteList: any[];
  studiesList: any[];
  approvalUserList: User[] = [];
  existingUserList: UserApproval[] = [];
  userList: User[] = [];
  userRoles: any;
  selectedSudy: string = 'All';
  selectedSite: string = 'All';
  selectedIndex: number = -1;
  selectedUserSudy: string = '';
  selectedUserSite: string = '';
  selectedUserRole: string = '';
  filteredSitesUser: any[] = [];

  assignedUser: User | null;
  assignedSudy: string = '';
  assignedSite: string = '';
  assignedRole: string = '';
  assignedSitesList: any[] = [];
  errorMsgAssignSite: string = '';

  newRoleSudy: string = '';
  newRoleSite: string = '';
  newRole: string = '';
  userNewRole: string = '';
  newRoleSitesList: any[] = [];
  errorMsgNewRole: string = '';
  constructor(
    private store$: Store<VideoTrialStoreState.State>,
  ) { }

  ngOnInit(): void {
    this.store$.dispatch(VideoTrialStoreActions.getFilteredUser());
    this.store$.dispatch(VideoTrialStoreActions.getAllRole());
    this.store$.select(VideoTrialStoreSelectors.getAllRoles).subscribe((roles) => {

      this.userRoles = roles;
      if (roles.Studies) {
        this.studies = [{ value: 'All', viewValue: 'All' }];
        this.sites = [{ value: 'All', study: "All", viewValue: 'All' }];
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
      res.map(user => {
        if (user.accountStatus == 'Requested') {
          this.approvalUserList.push(user);
        } else if (user.accountStatus == 'Rejected' && Object.keys(user.selectedRole).length === 0) {
          let tempUser = {
            firstName: user.givenName,
            lastName: user.surname,
            emailId: user.email,
            role: "",
            study: "",
            site: "",
            siteRequestStatus: "Rejected",
            id: "",
            objectId: user.objectId
          }
          this.existingUserList.push(tempUser);
        } else {
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
                if (roleObj.siteRequestStatus !== "requested") {
                  this.existingUserList.push(tempUser)
                }
              })

            })
          }
        }


      });

    });
  }


  onStudySelect = () => {
    this.selectedSite = 'All';
  }
  getSite = () => {
    if (this.selectedSudy == 'All') {
      return this.sites;
    } else {
      return this.sites.filter(site => site.study == 'All' || site.study == this.selectedSudy)
    }
  }
  //  getUsers = () => {
  //   if (this.selectedSudy == 'All' && this.selectedSite == 'All') {
  //     return this.approvalUserList;
  //   } else if(this.selectedSudy !== 'All' && this.selectedSite == 'All') {
  //      return this.approvalUserList.filter(user=> user.study == this.selectedSudy)
  //   } else if(this.selectedSudy == 'All' && this.selectedSite !== 'All') {
  //     return this.approvalUserList.filter(user=> user.site == this.selectedSite)
  //  } else{
  //     return this.approvalUserList.filter(user=> user.study == this.selectedSudy && user.site == this.selectedSite)
  //   }
  // }
  getExistingUsers = () => {
    if (this.selectedSudy == 'All' && this.selectedSite == 'All') {
      return this.existingUserList;
    } else if (this.selectedSudy !== 'All' && this.selectedSite == 'All') {
      return this.existingUserList.filter(user => user.study == this.selectedSudy)
    } else if (this.selectedSudy == 'All' && this.selectedSite !== 'All') {
      return this.existingUserList.filter(user => user.site == this.selectedSite)
    } else {
      return this.existingUserList.filter(user => user.study == this.selectedSudy && user.site == this.selectedSite)
    }
  }
  onRowClick = (index: number, selectedRow: any) => {
    this.selectedIndex = index;
    this.selectedUserSite = selectedRow.site;
    this.selectedUserSudy = selectedRow.study;
    this.selectedUserRole = selectedRow.role;
  }
  resetSelection = () => {
    this.selectedIndex = -1;
  }
  getUserStudies = () => {
    return this.studies.filter(study => study.value != 'All')
  }
  getUserSites = () => {
    let allUserRequests: UserApproval[] = [...this.existingUserList];
    let selectedRequest = this.existingUserList[this.selectedIndex];
    let filteredArr = allUserRequests.filter(userRequest => userRequest.emailId == selectedRequest.emailId && userRequest.site != selectedRequest.site);
    let filteredSites = this.sites.filter(site => {
      if (filteredArr.find(ele => ele.site == site.value)) {
        return null;
      } else {
        return site;
      }

    });
    this.filteredSitesUser = filteredArr;
    if (this.selectedUserSudy == '') {
      return filteredSites.filter(site => site.value != 'All')
    } else {
      return filteredSites.filter(site => site.value != 'All' && site.study == this.selectedUserSudy)
    }
  }
  onUserStudySelect = () => {
    let filteredSites = this.sites.filter(site => site.value != 'All' && site.study == this.selectedUserSudy);
    this.selectedUserSite = filteredSites.length > 0 ? filteredSites[0].value : '';
  }


  //#######################################################################################################################
  onClickAssign = (index: number) => {
    //this.assignedUser = this.approvalUserList[index];
    this.assignedSitesList = [];
  }
  onClickAddRole = () => {
    let newSite = {
      id: this.assignedSudy + 'site-id-' + (Math.random() * 100).toFixed(3),
      role: this.assignedRole,
      site: this.assignedSite,
      siteRequestStatus: 'approved',
      study: this.assignedSudy
    } 
    if(!this.isExistRole(this.assignedUser.email, newSite) && 
    !this.assignedSitesList.find(user=> user.role == this.newRole && user.study == this.newRoleSudy && user.site == this.newRoleSite ) ){
      this.assignedSitesList.push(newSite);
      this.assignedRole = '';
      this.assignedSite = '';
      this.assignedSudy = '';
      this.errorMsgAssignSite = '';
    }else {
      console.log('Exist');
      this.errorMsgAssignSite = `Selected Role already exist for ${this.assignedUser.email}`;
    }

  }

  rejectUserRequest(emailId: string) {
    let encodedEmail = emailId.replace('@', '%40');
    this.store$.dispatch(
      VideoTrialStoreActions.updateUserRoles({ emailId: encodedEmail, selectedRole: {} })
    );
  }
  assignRoles = () => {
    let tempSelectedRole: any = {};
    this.assignedSitesList.map(role => {
      let newRole = {
        id: role.id,
        role: role.role,
        site: role.site,
        siteRequestStatus: 'approved'
      }
      if (tempSelectedRole[role.study]) {
        tempSelectedRole[role.study] = [...tempSelectedRole[role.study], ...[newRole]]
      } else {
        tempSelectedRole[role.study] = [newRole]
      }
    })

    this.updateUserRoles(this.assignedUser.email, tempSelectedRole);

  }

  updateUserRoles = (emailId: string, selectedRole: any) => {
    let encodedEmail = emailId.replace('@', '%40');
    this.store$.dispatch(
      VideoTrialStoreActions.updateUserRoles({ emailId: encodedEmail, selectedRole: selectedRole })
    );
  }

  cancelAssign = () => {
    this.assignedUser = null;
    this.assignedRole = '';
    this.assignedSite = '';
    this.assignedSudy = '';
  }

  updateUserRole(id: string, objectId: string) {
    this.selectedIndex = -1;
    const index = this.userList.findIndex((ele) => ele.objectId === objectId);
    let tempSelectedRole: any = {};
    if (this.userList[index].selectedRole) {

      Object.keys(this.userList[index].selectedRole).map(study => {
        let roleObjArr: any[] = [];
        if (this.userList[index].selectedRole[study]) {
          this.userList[index].selectedRole[study].map((roleObj: any) => {
            if (roleObj.id != id) {
              roleObjArr.push({
                id: roleObj.id,
                role: roleObj.role,
                site: roleObj.site,
                siteRequestStatus: roleObj.siteRequestStatus
              });
            }
          })
        }
        tempSelectedRole[study] = roleObjArr;
      });
      let newSite = {
        id: this.selectedUserSudy + 'site-id-' + (Math.random() * 100).toFixed(3),
        role: this.selectedUserRole,
        site: this.selectedUserSite,
        siteRequestStatus: 'approved'
      }
      if (tempSelectedRole[this.selectedUserSudy]) {
        tempSelectedRole[this.selectedUserSudy].push(newSite);
      } else {
        tempSelectedRole[this.selectedUserSudy] = [newSite]
      }
    }
    this.updateUserRoles(this.userList[index].email, tempSelectedRole);
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
    this.updateUserRoles(this.userList[index].email, tempSelectedRole);
  }

  onClickAddNewRole = () => {
    let newSite = {
      id: this.assignedSudy + 'site-id-' + (Math.random() * 100).toFixed(3),
      role: this.newRole,
      site: this.newRoleSite,
      siteRequestStatus: 'approved',
      study: this.newRoleSudy
    }
    if(!this.isExistRole(this.userNewRole, newSite) && 
    !this.newRoleSitesList.find(user=> user.role == this.newRole && user.study == this.newRoleSudy && user.site == this.newRoleSite ) ){
      console.log('Not Exist')
      this.newRoleSitesList.push(newSite);
      this.newRole = '';
      this.newRoleSite = '';
      this.newRoleSudy = '';
      this.errorMsgNewRole = '';
    } else {
      console.log('Exist');
      this.errorMsgNewRole = `Selected Role already exist for ${this.userNewRole} `;
    }
   
  }

  addNewRoles = () => {
    const index = this.userList.findIndex((ele) => ele.email === this.userNewRole);
    let tempSelectedRole: any = {};
    if (this.userList[index].selectedRole) {

      Object.keys(this.userList[index].selectedRole).map(study => {
        let roleObjArr: any[] = [];
        if (this.userList[index].selectedRole[study]) {
          this.userList[index].selectedRole[study].map((roleObj: any) => {
              roleObjArr.push({
                id: roleObj.id,
                role: roleObj.role,
                site: roleObj.site,
                siteRequestStatus: roleObj.siteRequestStatus
              });
          })
        }
        tempSelectedRole[study] = roleObjArr;
      });

   
    }
    this.newRoleSitesList.map(newRole => {
      let newSite = {
        id: newRole.study + 'site-id-' + (Math.random() * 100).toFixed(3),
        role: newRole.role,
        site: newRole.site,
        siteRequestStatus: 'approved'
      }
      if (tempSelectedRole[newRole.study]) {
        tempSelectedRole[newRole.study].push(newSite);
      } else {
        tempSelectedRole[newRole.study] = [newSite]
      }
    })


    console.log(tempSelectedRole);
    this.updateUserRoles(this.userNewRole, tempSelectedRole);
    this.newRoleSitesList = [];
    this.newRole = '';
    this.newRoleSite = '';
    this.newRoleSudy = '';
    this.userNewRole = '';

  }
  geSitesForNewRole = () => {
    let allUserRequests: UserApproval[] = [...this.existingUserList];
    let selectedRequest = this.existingUserList.find(user => user.emailId == this.userNewRole);
    if (selectedRequest) {
      let filteredArr = allUserRequests.filter(userRequest => userRequest.emailId == selectedRequest.emailId && userRequest.site != selectedRequest.site);
      let filteredSites = this.sites.filter(site => {
        if (filteredArr.find(ele => ele.site == site.value)) {
          return null;
        } else {
          return site;
        }

      });
      this.filteredSitesUser = filteredArr;
      if (this.newRoleSudy == '') {
        return filteredSites.filter(site => site.value != 'All')
      } else {
        return filteredSites.filter(site => site.value != 'All' && site.study == this.newRoleSudy)
      }
    } 
    return [];
  }
  geSitesAssignRole = () => {

      if (this.assignedSudy == '') {
        return this.sites.filter(site => site.value != 'All')
      } else {
        return this.sites.filter(site => site.value != 'All' && site.study == this.assignedSudy)
      }
 
  }

  removeSiteFromNewRole = (id: number) => {
    this.newRoleSitesList = this.newRoleSitesList.filter(role => role.id !== id);
  }
  removeSiteAssignedSites = (id: number) => {
    this.assignedSitesList = this.assignedSitesList.filter(role => role.id !== id);
  }
   isExistRole =( emailId: string,newRole: any) => {
     console.log(emailId);
     console.log(newRole);
     console.log(this.existingUserList);
     for (let user of this.existingUserList) {
       if(user.emailId == emailId && user.study == newRole.study && user.site == newRole.site && user.role == newRole.role){
         console.log('Existing Role;')
         return true;

       }
     };
     console.log('Non Existing Role;')
     return false;
   }

}
