import { Component, OnInit } from '@angular/core';
import { AccessProviders } from 'src/app/providers/access-providers';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    private accsPrvds: AccessProviders
  ) { }

  ngOnInit() {
  }

  logout() {
    this.accsPrvds.logout();
  }

}
