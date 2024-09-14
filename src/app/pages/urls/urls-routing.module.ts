import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UrlsPage } from './urls.page';

const routes: Routes = [
  {
    path: '',
    component: UrlsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UrlsPageRoutingModule {}
