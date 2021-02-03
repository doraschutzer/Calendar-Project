import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Service } from 'src/app/interfaces/service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {
  public service: Service = {};
  loading = true;
  collapseCard = true;
  modal = false;
  serviceEditing: Service = {};
  constructor(
    private router: Router,
    public authService: AuthService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loading = false;
    this.userIsConnected();
  }
  
  async userIsConnected() {  
    await this.authService.userIsConnected(this.router, 'SERVICE');
  }

  collapseUpDown() {
    this.collapseCard = !this.collapseCard;
  }

  addEvent() {
    this.service.uid = this.authService.uid;
    this.authService.saveOrUpdateService(this.service);
    this.listServices();
    this.service = {};
  }

  async listServices() {
    await this.authService.listServices();
  }

  async remove(service: Service) {
    const alert = await this.alertCtrl.create({
      header: 'Remover Serviço?',
      message: 'Deseja mesmo excluir o serviço?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sim',
          handler: data => {
            this.authService.removeService(service);
            this.listServices();
          }
        }
      ],
    });
    await alert.present();
  }

  openModal(service: Service) {
    this.modal = true;
    this.serviceEditing = service;
  }

  dismissModal() {
    this.modal = false;
  }

  async edit() {
    this.authService.saveOrUpdateService(this.serviceEditing);
    this.listServices();
    this.serviceEditing = {};
    this.dismissModal();
  }
}
