import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './../interfaces/user';
import { Service } from '../interfaces/service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Customer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: any;
  public services = [];
  public customers = [];
  public uid: any;
  private SERVICE_PATH = 'services/';
  private CUSTOMER_PATH = 'customers/';
  
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFireDatabase
  ) { }

  login(user: User) {
    return this.auth.setPersistence('local').then(_ => {
      return this.auth.signInWithEmailAndPassword(user.email, user.password);
    });
  }

  logout() {
    return this.auth.signOut();
  }

  register(user: User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  async userIsConnected(router, route) {
    this.currentUser = (await this.auth.onAuthStateChanged(user => {
      if ( user ) {
        this.uid = user.uid;

        switch(route) {
          case 'LOGIN': {
            router.navigateByUrl('/menu/home');
            break;
          }
          case 'SERVICE': {
            this.listServices();
            break;
          }
          case 'CUSTOMER': {
            this.listCustomers();
            break;
          }
          case 'HOME': {
            this.listServices();
            this.listCustomers();
            break;
          }
        }
      } else if ( route != 'LOGIN' ) {
        router.navigateByUrl('/login');
      }
    }));
  }

  async getCurrentUser() {
    this.currentUser = (await this.auth.onAuthStateChanged(user => {
      return user;
    }));
  }

  saveOrUpdateService(service: Service) {
    return new Promise<void>((resolve, reject) => {
      if (service.id) {
        this.db.list(this.SERVICE_PATH)
          .update(service.id.toString(), service)
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        return this.db.list(this.SERVICE_PATH)
          .push(service)
          .then(() => resolve());
      }
    });
  }

  listServices() {
    this.db.list(this.SERVICE_PATH, ref => ref.orderByChild('uid').equalTo(this.uid))
    .snapshotChanges()
    .subscribe(res => {
      this.services = [];
      res.forEach(element => {
        var service: any = element.payload.toJSON();
        service.id = element.key;
        this.services.push(service as Service);
      });
    });
    return this.services;
  }

  removeService(service: Service) {
    this.db.list(this.SERVICE_PATH).remove(service.id.toString());
  }

  saveOrUpdateCustomer(customer: Customer) {
    return new Promise<void>((resolve, reject) => {
      if (customer.id) {
        this.db.list(this.CUSTOMER_PATH)
          .update(customer.id.toString(), customer)
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        return this.db.list(this.CUSTOMER_PATH)
          .push(customer)
          .then(() => resolve());
      }
    });
  }

  async listCustomers() {
    this.db.list(this.CUSTOMER_PATH, ref => ref.orderByChild('uid').equalTo(this.uid))
    .snapshotChanges()
    .subscribe(res => {
      this.customers = [];
      res.forEach(element => {
        var customer: any = element.payload.toJSON();
        customer.id = element.key;
        this.customers.push(customer as Customer);
      });
    });
    return this.customers;
  }

  removeCustomer(customer: Customer) {
    this.db.list(this.CUSTOMER_PATH).remove(customer.id.toString());
  }
}
