import { MsalService } from '@azure/msal-angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss'],
})
export class NotAuthorizedComponent implements OnInit {
  time = 5;
  constructor(private authService: MsalService) {}

  ngOnInit(): void {
    sessionStorage.clear();
    setInterval(() => {
      this.time -= 1;
      if (this.time <= 0) {
        this.authService.logout();
      }
    }, 1000);
  }
}
