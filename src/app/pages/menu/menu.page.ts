import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  private pages = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home-outline'
    },
    {
      title: 'Serviços',
      url: '/menu/service',
      icon: 'briefcase-outline'
    },
    {
      title: 'Clientes',
      url: '/menu/customer',
      icon: 'person-outline'
    },
    {
      title: 'Faturamento',
      url: '/menu/finance',
      icon: 'trending-up-outline'
    },
    {
      title: 'Despesas',
      url: '/menu/spent',
      icon: 'card-outline'
    },
  ];
  private selectedPath = '';
  private loading: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  )
  {
    this.router.events.subscribe((event: RouterEvent) => {
      if ( event.url ) {
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
  }

  async logout() {
    await this.presentLoading();

    try {
      await this.authService.logout();
    } catch (error) {
      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
      this.router.navigateByUrl('/login');
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

}
