import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public userLogin: User = {};

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userIsConnected();
  }

  async userIsConnected() {
    try {
      await this.authService.userIsConnected();
      console.log(this.authService.userIsConnected());
    } catch (error) {
      
    } finally {
      
    }
  }
}
