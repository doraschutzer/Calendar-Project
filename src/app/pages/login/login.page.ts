import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private userLogin: User = {};
  private userConnected: any;
  private loading: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.userIsConnected();
  }

  async userIsConnected() {
    await this.authService.userIsConnected(this.router);
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
      this.router.navigateByUrl('/menu/home');
    } catch (error) {
      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  async openToast() {
    const alert = await this.alertCtrl.create({
      header: 'Esqueci minha senha',
      // subHeader: 'Subtitle',
      message: 'Digite seu e-mail para recuperar sua senha.',
      inputs: [
        {
          name: 'email',
          placeholder: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          // handler: data => {
          //   console.log('Cancel clicked');
          // }
        },
        {
          text: 'Enviar',
          handler: data => {
            this.resetPassword(data.password);
          }
        }
      ],
    });
    await alert.present();
  }

  async resetPassword(email) {
    if ( email ) {
      try {
        await this.authService.resetPassword(email);
      } catch (error) {
        this.presentToast(error.message);
      }
    } else {
      this.presentToast('Invalid email! Try again.');
    }
  }
}
