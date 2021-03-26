import { MsalService } from '@azure/msal-angular';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss'],
})
export class NotAuthorizedComponent implements OnInit {
  time = 5;
  msg = '';
  constructor(private authService: MsalService, private cdref: ChangeDetectorRef) {}

  ngOnInit(): void {
    setInterval(() => {
      if (this.time <= 0) {
        this.authService.logout();
      }
      this.time = this.time -1;
      this.cdref.detectChanges();
    }, 1000);
    const token: any = jwt_decode(sessionStorage.getItem('token'));
    if (token.extension_accountstatus === 'Requested') {
      this.msg = 'Your request is not yet approved';
    } else if(token.extension_accountstatus === 'Rejected') {
      this.msg = 'Your request is Rejected by Admin';
    }
    sessionStorage.clear();
  }
}
