import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UrlsPageRoutingModule } from './urls-routing.module';

import { UrlsPage } from './urls.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UrlsPageRoutingModule
  ],
  declarations: [UrlsPage]
})
export class UrlsPageModule {}
