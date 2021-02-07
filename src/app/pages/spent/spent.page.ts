import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Spent } from 'src/app/interfaces/spent';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-spent',
  templateUrl: './spent.page.html',
  styleUrls: ['./spent.page.scss'],
})
export class SpentPage implements OnInit {
  public spent: Spent = {};
  loading = true;
  collapseCard = true;
  modal = false;
  date: string;
  spentEditing: Spent = {};
  constructor(
    private router: Router,
    public authService: AuthService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loading = false;
    this.userIsConnected();
    this.resetSpent();
    this.date = new Date().toISOString();
  }

  resetSpent() {
    this.spent.date = new Date().toISOString();
  }
  
  async userIsConnected() {  
    await this.authService.userIsConnected(this.router, 'SPENT');
  }

  collapseUpDown() {
    this.collapseCard = !this.collapseCard;
  }

  addEvent() {
    this.spent.uid = this.authService.uid;
    this.authService.saveOrUpdateSpent(this.spent);
    this.listSpents();
    this.spent = {};
    this.resetSpent();
  }

  async listSpents() {
    if (!this.date) this.date = new Date().toLocaleString();
    await this.authService.listSpents(new Date(this.date));
  }

  async remove(spent: Spent) {
    const alert = await this.alertCtrl.create({
      header: 'Remover Despesa?',
      message: 'Deseja mesmo excluir a despesa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sim',
          handler: data => {
            this.authService.removeSpent(spent);
            this.listSpents();
          }
        }
      ],
    });
    await alert.present();
  }

  openModal(spent: Spent) {
    this.modal = true;
    this.spentEditing = spent;
  }

  dismissModal() {
    this.modal = false;
  }

  async edit() {
    this.authService.saveOrUpdateSpent(this.spentEditing);
    this.listSpents();
    this.spentEditing = {};
    this.dismissModal();
  }
}

