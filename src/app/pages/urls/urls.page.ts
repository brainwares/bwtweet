import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AccessProviders } from 'src/app/providers/access-providers';

@Component({
  selector: 'app-urls',
  templateUrl: './urls.page.html',
  styleUrls: ['./urls.page.scss'],
})
export class UrlsPage implements OnInit {
  public token;
  public page=1;
  private limit=10;
  public data;
  public total_pages;
  public crossorigin=false;
  public server;
  public itemClicked = -1;

  constructor(
    private storage: Storage,
    private accsPrvds: AccessProviders,
    private alertController: AlertController,
    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    let stg = await this.storage.get('storage_bwt');
    let data = stg.data;
    this.token = data.sid;
    this.server = this.accsPrvds.server;
    // console.log(navigator.userAgent.indexOf('Firefox'));
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Mac') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
      this.crossorigin=true;
    };
    this.loadData();
  }

  async doRefresh(e) {
    this.page = 1;
    this.loadData(e);
  }

  async loadData(e=null) {
    await this.accsPrvds.showLoader("Please wait....");
    let rnd = Math.floor(Math.random() * 10);
    let params = {
      'nd': rnd
    };
    let body = new HttpParams({fromObject: params});
    this.accsPrvds.token = this.token;
    return new Promise(resolve => {
      this.accsPrvds.getData('/api/list_url/' + this.limit + '/' + this.page, body).subscribe(
        (res:any) => {
          this.accsPrvds.dismissLoader();
          if (e!=null)
            e.target.complete();
          if (typeof res !== 'undefined') {
            this.data = null;
            if (res.success) {
              this.data = res.data;
              this.total_pages = Math.ceil(res.total_records / this.limit);
              // console.log(res.data);
            } else {
              this.accsPrvds.presentToast(res.message);
            }
          }
        }, (err) => {
          this.accsPrvds.dismissLoader();
          this.accsPrvds.presentToast('Timeout');
        }
      );
    });
  }

  prevPage() {
    // this.first_id = res.data[0].id;
    if (this.page <= 1) return false;
    this.page = this.page - 1;
    this.loadData(null);
  }

  nextPage() {
    this.page = this.page + 1;
    this.loadData(null);
  }

  async gotoPage() {
    const alert = await this.alertController.create({
      header: 'Go to Page',
      inputs: [
        {
          name: 'page',
          type: 'number',
          value: Number(this.page),
          placeholder: 'Page Number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (d) => {
            this.page = Number(d.page);
            this.loadData(null);
          }
        }
      ]
    });
    await alert.present();
  }

  async addUrlDialog() {
    const alert = await this.alertController.create({
      header: 'Paste Url',
      inputs: [
        {
          name: 'url',
          type: 'text',
          placeholder: 'Tweet Url'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (d) => {
            // console.log(d.url);
            this.addUrl(d.url);
          }
        }
      ]
    });
    await alert.present();
  }

  async delUrlDialog(id) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (d) => {
            // console.log(d.url);
            this.delUrl(id);
          }
        }
      ]
    });
    await alert.present();
  }

  async addUrl(url) {
    await this.accsPrvds.showLoader("Please wait....");
    let params = {
      'url': url,
      'token': this.token
    }
    let body = new HttpParams({fromObject: params});
    this.accsPrvds.token = this.token;
    return new Promise(resolve => {
      this.accsPrvds.postData('/api/add_url', body).subscribe(
        (res:any) => {
          this.accsPrvds.dismissLoader();
          if (typeof res !== 'undefined') {
            if (res.success) {
              // console.log(res.data);
              this.accsPrvds.presentToast(res.message);
              this.loadData();
            } else {
              this.accsPrvds.presentToast(res.message);
            }
          }
        }, (err) => {
          this.accsPrvds.dismissLoader();
          this.accsPrvds.presentToast('Timeout');
        }
      );
    });
  }

  async delUrl(id) {
    await this.accsPrvds.showLoader("Please wait....");
    let params = {
      'token': this.token
    }
    let body = new HttpParams({fromObject: params});
    this.accsPrvds.token = this.token;
    return new Promise(resolve => {
      this.accsPrvds.postData('/api/del_url/' + id, body).subscribe(
        (res:any) => {
          this.accsPrvds.dismissLoader();
          if (typeof res !== 'undefined') {
            if (res.success) {
              // console.log(res.data);
              this.accsPrvds.presentToast(res.message);
              this.loadData();
            } else {
              this.accsPrvds.presentToast(res.message);
            }
          }
        }, (err) => {
          this.accsPrvds.dismissLoader();
          this.accsPrvds.presentToast('Timeout');
        }
      );
    });
  }

  toggleClick(idx) {
    // alert("KLik " + idx);
    this.itemClicked = idx;
  }

}
