import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private db: AngularFireAuth) { }

  login(user: User) {
    return this.db.signInWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    return this.db.signOut();
  }

  register(user: User) {
    return this.db.createUserWithEmailAndPassword(user.email, user.password);
  }

  userIsConnected() {
    return this.db.user;
  }
}
