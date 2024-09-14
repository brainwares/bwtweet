import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AccessProviders } from 'src/app/providers/access-providers';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private accPrvds: AccessProviders,
    private menu: MenuController
  ) { 
    this.menu.enable(true, 'main-content');
  }

  ngOnInit() {
    let _ac = this.accPrvds;
    setTimeout(function() {
      _ac.dismissLoader();
    }, 1000);
  }

}
