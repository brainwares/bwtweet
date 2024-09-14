import { Component, OnInit } from '@angular/core';
import { AccessProviders } from 'src/app/providers/access-providers';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public version;

  constructor(
    private accsPrvds: AccessProviders
  ) { }

  ngOnInit() {
    this.version = this.accsPrvds.version;
  }

}
