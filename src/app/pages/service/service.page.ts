import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/interfaces/service';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {
  public service: Service = {};
  loading = true;
  collapseCard = true;
  constructor() { }

  ngOnInit() {
    this.loading = false;
  }

  collapseUpDown() {
    this.collapseCard = !this.collapseCard;
  }

  addEvent() {

  }

}
