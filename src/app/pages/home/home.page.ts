import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarComponent } from 'ionic2-calendar';
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
  eventSource = [];
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
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userIsConnected();
    this.resetEvents();
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
    this.loading = false;
  }

  addEvent() {
    let eventCopy = {
      title: this.event.title,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
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

}
