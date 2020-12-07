import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: any;

  constructor(
    private db: AngularFireAuth
  ) { }

  login(user: User) {
    return this.db.setPersistence('local').then(_ => {
      return this.db.signInWithEmailAndPassword(user.email, user.password);
    });
  }

  logout() {
    return this.db.signOut();
  }

  register(user: User) {
    return this.db.createUserWithEmailAndPassword(user.email, user.password);
  }

  resetPassword(email: string) {
    return this.db.sendPasswordResetEmail(email);
  }

  async userIsConnected(router) {
    this.currentUser = (await this.db.onAuthStateChanged(user => {
      if ( user ) {
        router.navigateByUrl('/menu/home');
      } else {
        router.navigateByUrl('/login');
      }
    }));
  }
}
