import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AccessProviders } from 'src/app/providers/access-providers';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public username: string = '';
  public password: string = '';

  constructor(
    private router: Router,
    private accsPrvds: AccessProviders,
    private menu: MenuController
  ) { 
    this.menu.enable(false, 'main-content');
  }

  ngOnInit() {
    let _ac = this.accsPrvds;
    setTimeout(function() {
      _ac.dismissLoader();
    }, 1000);
  }

  async tryLogin() {
    this.accsPrvds.username = this.username;
    this.accsPrvds.password = this.password;
    this.accsPrvds.tryLogin();
  }

}
