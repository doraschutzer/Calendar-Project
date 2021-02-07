import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './../interfaces/user';
import { Service } from '../interfaces/service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Customer } from '../interfaces/customer';
import { Event } from '../interfaces/event';
import { Spent } from '../interfaces/spent';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: any;
  public services = [];
  public spents = [];
  public customers = [];
  public events = [];
  public totalConfirmedEvents = 0;
  public totalNotConfirmedEvents = 0;
  public totalValueWorked = 0;
  public totalValueSpent = 0;
  public uid: any;
  private SERVICE_PATH = 'services/';
  private CUSTOMER_PATH = 'customers/';
  private EVENT_PATH = 'events/';
  private SPENT_PATH = 'spents/';
  
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
          case 'SPENT': {
            this.listSpents(new Date());
            break;
          }
          case 'CUSTOMER': {
            this.listCustomers();
            break;
          }
          case 'HOME': {
            this.listServices();
            this.listCustomers();
            this.listEvents(new Date());
            break;
          }
          case 'FINANCE': {
            this.listEventsByMonth(new Date());
            this.listSpents(new Date());
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
  
  saveOrUpdateSpent(spent: Spent) {
    return new Promise<void>((resolve, reject) => {
      if (spent.id) {
        this.db.list(this.SPENT_PATH)
          .update(spent.id.toString(), spent)
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        return this.db.list(this.SPENT_PATH)
          .push(spent)
          .then(() => resolve());
      }
    });
  }

  listSpents(date: Date) {
    this.totalValueSpent = 0;
    this.db.list(this.SPENT_PATH, ref => ref.orderByChild('uid').equalTo(this.uid))
    .snapshotChanges()
    .subscribe(res => {
      this.spents = [];
      res.forEach(element => {
        var spent: any = element.payload.toJSON();
        let dateSpent: Date = new Date(spent.date);
        if ( dateSpent.getMonth() == date.getMonth() &&
              dateSpent.getFullYear() == date.getFullYear() ) {
          spent.id = element.key;
          this.totalValueSpent += spent.value;
          this.spents.push(spent as Service);
        }
      });
    });
    return this.spents;
  }

  removeSpent(spent: Spent) {
    this.db.list(this.SPENT_PATH).remove(spent.id.toString());
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

  async listEventsByMonth(dateFilter: Date) {
    this.totalConfirmedEvents = 0;
    this.totalValueWorked = 0;
    this.totalNotConfirmedEvents = 0;
    this.db.list(this.EVENT_PATH, ref => ref.orderByChild('uid').equalTo(this.uid))
    .snapshotChanges()
    .subscribe(res => {
      this.events = [];
      res.forEach(element => {
        var event: any = element.payload.toJSON();
        event.id = element.key;
        let startDate: Date = new Date(event.startTime);
        let endDate: Date = new Date(event.endTime);
        if ( ( startDate.getMonth() == dateFilter.getMonth() && 
                startDate.getFullYear() == dateFilter.getFullYear() ) || 
             ( endDate.getMonth() == dateFilter.getMonth() && 
                  endDate.getFullYear() == dateFilter.getFullYear() ) ) {
          if ( event.confirm ) {
            this.totalConfirmedEvents++;
            this.totalValueWorked += event.total;
          } else {
            this.totalNotConfirmedEvents++;
          }
          this.events.push(event as Event); 
        }
      });
      this.events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    });
    return this.events;
  }

  async listEvents(dateFilter: Date) {
    this.db.list(this.EVENT_PATH, ref => ref.orderByChild('uid').equalTo(this.uid))
    .snapshotChanges()
    .subscribe(res => {
      this.events = [];
      res.forEach(element => {
        var event: any = element.payload.toJSON();
        event.id = element.key;
        let startDate: Date = new Date(event.startTime);
        let endDate: Date = new Date(event.endTime);
        if ( ( startDate.getDate() == dateFilter.getDate() &&
                startDate.getMonth() == dateFilter.getMonth() && 
                  startDate.getFullYear() == dateFilter.getFullYear() ) || 
            ( endDate.getDate() == dateFilter.getDate() &&
                endDate.getMonth() == dateFilter.getMonth() && 
                  endDate.getFullYear() == dateFilter.getFullYear() ) ) {
          this.events.push(event as Event); 
        }
      });
      this.events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    });
    return this.events;
  }

  removeEvent(event: Event) {
    this.db.list(this.EVENT_PATH).remove(event.id.toString());
  }

  saveOrUpdateEvent(event: Event) {
    return new Promise<void>((resolve, reject) => {
      if (event.id) {
        this.db.list(this.EVENT_PATH)
          .update(event.id.toString(), event)
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        return this.db.list(this.EVENT_PATH)
          .push(event)
          .then(() => resolve());
      }
    });
  }
}
