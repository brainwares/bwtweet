import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AccessProviders } from './providers/access-providers';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Urls', url: '/urls', icon: 'link' },
    { title: 'Archives', url: '/archives', icon: 'play' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
    { title: 'Log Out', url: '/logout', icon: 'log-out' },
  ];
  private token;
  public email;


  constructor(
    private storage: Storage,
    private accsPrvds: AccessProviders,
  ) {
    this.storage.create();
  }

  async ngOnInit() {
    let stg = await this.storage.get('storage_bwt');
    if (stg == null) {
      this.accsPrvds.logout();
      return false;
    }
    let data = stg.data;
    this.token = data.sid;
    this.email = data.email;
  }
}
