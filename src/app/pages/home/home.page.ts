import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarComponent } from 'ionic2-calendar';
import { Customer } from 'src/app/interfaces/customer';
import { Service } from 'src/app/interfaces/service';
import { Event } from 'src/app/interfaces/event';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public userLogin: User = {};
  public loading = true;
  collapseCard = true;
  services: any;
  customer: Customer;
  servicesWithoutValue = [];
  public totalValue: number;
  eventSave: Event = {};
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  event = {
    title: '',
    startTime: '',
    endTime: '',
  };
  viewTitle = '';
  modal = false;
  eventEditing: Event;
  editSelectedServices = [];
  editSelectedServicesWithoutValue = [];
  date: Date = new Date();
  editForm: FormGroup;
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  constructor(
    public authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.userIsConnected();
    this.resetEvents();
    this.totalValue = 0;
  }
  
  async userIsConnected() {
    await this.authService.userIsConnected(this.router, 'HOME');
  }

  resetEvents() {
    this.event = {
      title: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    };
    this.customer = {};
    this.services = [];
    this.loading = false;
  }

  addEvent() {
    this.eventSave.services = this.services;
    this.eventSave.customer = this.customer;
    this.eventSave.startTime = this.event.startTime;
    this.eventSave.endTime = this.event.endTime;
    this.eventSave.total = this.totalValue;
    this.eventSave.uid = this.authService.uid;
    this.eventSave.confirm = false;

    this.authService.saveOrUpdateEvent(this.eventSave);
    this.resetEvents();
    this.getListEvents();
  }

  onEventSelected() {

  }

  onTitleChanged() {

  }

  onTimeSelected() {

  }

  collapseUpDown(){
    this.collapseCard = !this.collapseCard;
  }

  onChangeServiceOrValue() {
    var self = this;
    this.totalValue = 0;
    this.servicesWithoutValue = [];
    this.services.forEach(function (service) {
      if ( !service.value || service.withoutValue ) {
        service.withoutValue = true;
        self.servicesWithoutValue.push(service);
      }
      self.totalValue += service.value;
    });
  }

  async getListEvents() {
    await this.authService.listEvents(new Date(this.date));
  }

  async remove(event: Event) {
    const alert = await this.alertCtrl.create({
      header: 'Remover Evento?',
      message: 'Deseja mesmo excluir o evento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sim',
          handler: data => {
            this.authService.removeEvent(event);
            this.getListEvents();
          }
        }
      ],
    });
    await alert.present();
  }

  openModal(event: Event) {
    this.editSelectedServices = [];
    this.editSelectedServicesWithoutValue = [];
    this.eventEditing = event;
    for ( let obj of Object.entries(event.services) ) {
      let service: any = obj[1];
      this.editSelectedServices.push(service.name);

      if ( service.withoutValue ) {
        this.editSelectedServicesWithoutValue.push(service);
      }
    }
    this.modal = true;
    this.editForm = this.formBuilder.group({
      services: this.editSelectedServicesWithoutValue,
    });
  }

  dismissModal() {
    this.modal = false;
  }

  onChangeServiceOrValueEdit() {
    var self = this;
    this.eventEditing.total = 0;
    this.editSelectedServicesWithoutValue = [];
    console.log(this.editSelectedServices);

    this.eventEditing.services.forEach(function (service) {
      console.log(service);
      if ( !service.value || service.withoutValue ) {
        service.withoutValue = true;
        self.editSelectedServicesWithoutValue.push(service);
      }
      self.eventEditing.total += service.value;
    });
  }

  async confirmEvent(event: Event) {
    if ( event.total && event.total > 0 ) {
      const alert = await this.alertCtrl.create({
        header: 'Evento Concluído',
        message: 'Este evento foi pago pelo cliente?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Sim',
            handler: data => {
              event.confirm = true;
              event.paid = true;
              this.authService.saveOrUpdateEvent(event);
            }
          },
          {
            text: 'Não',
            handler: data => {
              event.confirm = true;
              event.paid = false;
              this.authService.saveOrUpdateEvent(event);
            }
          }
        ],
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Evento Concluído',
        message: 'Concluir Evento?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
          },
          {
            text: 'Sim',
            handler: data => {
              event.confirm = true;
              this.authService.saveOrUpdateEvent(event);
            }
          }
        ],
      });
    }
  }


}
