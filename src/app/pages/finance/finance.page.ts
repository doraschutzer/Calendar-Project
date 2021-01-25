import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
})
export class FinancePage implements OnInit {
  date: Date = new Date();
  searchDate: Date = new Date();

  constructor(
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.userIsConnected();
  }

  async userIsConnected() {  
    await this.authService.userIsConnected(this.router, 'FINANCE');
  }

  async getList() {
    await this.authService.listEvents(new Date(this.date));
    this.searchDate = this.date;
  }

  // calculateInformations() {
  //   this.authService.forEach(element => {
  //     if 
  //   });
  // }

}
