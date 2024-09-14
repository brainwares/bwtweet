import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AccessProviders } from 'src/app/providers/access-providers';
import * as moment from 'moment';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.page.html',
  styleUrls: ['./archives.page.scss'],
})
export class ArchivesPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public token;
  public page=1;
  public limit=10;
  public data;
  public total_pages;
  public server;
  public crossorigin=false;
  public tweets = [];
  public loaded = false;

  constructor(
    private storage: Storage,
    private accsPrvds: AccessProviders,
    private alertController: AlertController,
    private modalCtrl: ModalController
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
    // await this.accsPrvds.showLoader("Please wait....");
    this.loaded = false;
    let rnd = Math.floor(Math.random() * 10);
    let params = {
      'nd': rnd
    };
    let body = new HttpParams({fromObject: params});
    this.accsPrvds.token = this.token;
    this.content.scrollToTop(300);
    return new Promise(resolve => {
      this.accsPrvds.getData('/api/archives/' + this.limit + '/' + this.page, body).subscribe(
        (res:any) => {
          // this.accsPrvds.dismissLoader();
          if (e!=null)
            e.target.complete();
          if (typeof res !== 'undefined') {
            this.data = null;
            if (res.success) {
              this.data = res.data;
              // console.log(res.data);
              let tw = [];
              res.data.forEach(function(v) {
                // console.log(v.id);
                let t = eval(v.raw_data);
                // console.log(t);
                if (t[0].data.tweetResult[0].result.__typename == 'Tweet') {
                  tw.push(t[0].data.tweetResult[0].result);
                } else {
                  tw.push(t[0].data.tweetResult[0].result.tweet);
                }
                // console.log(tw);
                // console.log(tw[0].data.tweetResult[0].result);
                // console.log(eval(v.raw_data[0].data.tweetResult[0].result));
                // console.log(JSON.parse(v.raw_data));
              });
              this.tweets = tw;
              // console.log(tw);
              // console.log(JSON.parse(res.data.raw_data));
              this.total_pages = Math.ceil(res.total_records / this.limit);
              // console.log(this.tweets);
              this.loaded = true;
            } else {
              this.accsPrvds.presentToast(res.message);
            }
          }
        }, (err) => {
          this.accsPrvds.dismissLoader();
          this.accsPrvds.presentToast('Timeout');
        }
      );
      // console.log(tw);
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


  parseText(dt) {
    // console.log(dt);
    let teks = dt.legacy.full_text;
    let hasil = '';
    let mulai = dt.legacy.display_text_range[0];
    let akhir = dt.legacy.display_text_range[1];
    hasil = teks.substring(mulai,akhir);
    return hasil;
  }

  parseLink(dt) {
    let url = dt.legacy.extended_entities.media[0].url;
    return url;
  }

  formatJam(jam) {
    // console.log(jam);
    return moment(jam).format('DD/MM/YYYY hh:mm');
  }

  genVidUrl(id) {
    let hasil = this.server + '/media/' + id + '?token=' + this.token + '&version=' + this.accsPrvds.version;
    return hasil;
  }

  genPoster(id) {
    let hasil = this.server + '/poster/' + id + '?token=' + this.token + '&version=' + this.accsPrvds.version;
    return hasil;
  }

  tampilLog(isi) {
    console.log(isi);
  }

}
