import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarComponent } from 'ionic2-calendar';
import { Customer } from 'src/app/interfaces/customer';
import { Service } from 'src/app/interfaces/service';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

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
  eventSource: any = [];
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
  viewTitle = '';
  minDate = new Date().toISOString();
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  constructor(
    public authService: AuthService,
    private router: Router,
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
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
    this.customer = {};
    this.services = [];
    this.loading = false;
  }

  addEvent() {
    let eventCopy = {
      title: this.event.title,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      services: this.services,
      customer: this.customer,
      desc: this.event.desc
    };

    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
 
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }
 
    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvents();
    console.log(this.eventSource);
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


}
