import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
})
export class FinancePage implements OnInit {
  date: string;
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
    await this.authService.listEventsByMonth(new Date(this.date));
    await this.authService.listSpents(new Date(this.date));
    this.searchDate = new Date(this.date);
  }
}
