import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';
import { map, timeout } from 'rxjs/operators';

@Injectable()
export class AccessProviders {
  public server;
  public token;
  public email;
  public loader;
  public username;
  public password;
  public version;

  constructor(
    public http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private storage: Storage
  ) {
    this.server = environment.server;
    this.version = environment.version;
    // this.setupDb();
  }

  async setupDb() {
    let stg = await this.storage.get('storage_bwt');
    // console.log(stg);
    
    if (stg !== null && typeof stg !== 'undefined') {
      this.token = stg.data.sid;
    }
  }

  postData(api, body) {
    body = body.append('version', this.version);
    body = body.append('source', 'mobile');
    if (typeof this.token !== 'undefined' && this.token != null)
      body = body.append('token', this.token);

    return this.http.post(this.server + api, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      })
      .pipe(timeout(20000))
      .pipe(map(res => res));
  }

  getData(api, body) {
    body = body.append('version', this.version);
    body = body.append('token', this.token);
    body = body.append('source', 'mobile');
    return this.http.get(this.server + api + '?' + body.toString())
      .pipe(timeout(20000))
      .pipe(map(res => res));
  }

  async tryLogin() {
    this.showLoader("Please wait....");

    return new Promise(resolve => {
      let body;
      body = new HttpParams()
        .set('username', this.username)
        .set('password', this.password);

      this.postData('/login', body).subscribe(
        async (res: any) => {
          await this.dismissLoader();
          if (res.success == true) {
            this.presentToast('Login Sukses');
            this.storage.set('storage_bwt', res);
            this.token = res.data.sid;
            this.navCtrl.navigateRoot(['/home']);
          } else {
            this.presentToast(res.message);
          }
        }, async (err) => {
          // console.log(err);
          await this.dismissLoader();
          this.presentToast('Timeout');
        });
    });
  }

  async validateToken() {
    await this.showLoader('Please wait....');
    var res = await this.storage.get('storage_bwt');
    if (res == null) {

      this.dismissLoader();
      this.navCtrl.navigateRoot('/intro');
      return false;
    }
    this.token = res.data.sid;
    this.email = res.data.email;
    
    // alert(this.push_token);
    return new Promise(resolve => {
      let body = new HttpParams()
        .set('token', this.token);

      this.postData('/api/auth_token', body).subscribe(
        async (res: any) => {
          if (res.success == true) {
            await this.dismissLoader();
            resolve(true);
            this.navCtrl.navigateRoot(['/home']);
          } else {
            await this.dismissLoader();
            this.storage.remove('storage_bwt');
            resolve(false);
            this.navCtrl.navigateRoot(['/login']);
          }
        }, async (err) => {
          await this.dismissLoader();
          this.presentToast('Timeout');
        });
    });
  }

  async logout() {
    // alert("Sampe sini");
    var stg = await this.storage.get('storage_bwt');
    if (stg != null) {
      this.token = stg.data.sid;
      this.showLoader('Please wait....');
      return new Promise(resolve => {
        let body = new HttpParams()
          .set('token', this.token);

        this.postData('/api/logout', body).subscribe(
          async (res: any) => {
            if (res.success == true) {
              await this.dismissLoader();
              this.presentToast('Logout successful');
              //console.log(res);
            } else {
              // console.log(res);
              await this.dismissLoader();
              this.presentToast('Logout failed');
            }
          }, async (err) => {
            await this.dismissLoader();
            this.presentToast('Timeout');
          }
        );
        this.storage.remove('storage_bwt');
        let navCtrl = this.navCtrl;
        setTimeout(function () {
          navCtrl.navigateRoot(['/login']);
        }, 1000);
      });
    } else {
      this.navCtrl.navigateRoot(['/login']);
    }
  }

  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 3000
    });
    toast.present();
  }

  async presentAlert(a, title='Warning!') {
    const alert = await this.alertCtrl.create({
      header: title,
      message: a,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showLoader(message) {
    const loader = await this.loadingCtrl.create({
      message: message,
      duration: 5000
    });
    loader.present();
    this.loader = loader;
  }

  dismissLoader() {
    if (typeof this.loader !== 'undefined') {
      this.loader.dismiss();
    }
  }

  getAvatarIcon(id) {
    return this.server + 'images/icon/' + id;
  }

  getAvatarThumb(id) {
    return this.server + 'images/thumb/' + id;
  }

  getParentMenu(theRoutes, pathCode) {
    let parent_id;
    theRoutes.forEach(function(val) {
      if (pathCode == val.shortname) parent_id = val.id;
    });
    return parent_id;
  }
}
