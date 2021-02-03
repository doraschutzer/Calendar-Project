import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Address } from '../../../app/interfaces/address';
import { Customer } from '../../../app/interfaces/customer';
import { AuthService } from '../../../app/services/auth.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {

  public customer: Customer = {};
  public address: Address = {};
  model: boolean = false;
  loading: boolean = false;
  collapseCard: boolean = true;
  public states = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
                   "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
                   "RS","RO","RR","SC","SP","SE","TO"];
  modal = false;
  customerEditing: Customer = {};
  addressEditing: Address = {};

  constructor( private router: Router,
    public authService: AuthService,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.userIsConnected();
  }

  async userIsConnected() {  
    await this.authService.userIsConnected(this.router, 'CUSTOMER');
  }

  collapseUpDown() {
    this.collapseCard = !this.collapseCard;
  }

  validCustomer(customer: Customer){
    return (!customer || this.validName(customer) || this.validPhone(customer));
  }

  validName(customer: Customer){
    return (!customer.name || customer.name == "");
  }

  validPhone(customer: Customer){
    return (!customer.telephone || customer.telephone === "") &&
    (!customer.cellphone || customer.cellphone === "");
  }

  addCustomer(){
   if(!this.validCustomer(this.customer)){
    this.customer.uid = this.authService.uid;
    this.customer.address = this.address;
    this.authService.saveOrUpdateCustomer(this.customer);
    this.customer = {};
    this.address = {};
   }
  }

  async getListCustomers() {
    await this.authService.listCustomers();
  }

  async remove(customer: Customer) {
    const alert = await this.alertCtrl.create({
      header: 'Remover Cliente?',
      message: 'Deseja mesmo excluir o cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sim',
          handler: data => {
            this.authService.removeCustomer(customer);
            this.getListCustomers();
          }
        }
      ],
    });
    await alert.present();
  }

  openModal(customer: Customer) {
    this.modal = true;
    this.customerEditing = customer;
    console.log(this.customerEditing);
    if ( customer.address ) {
      this.addressEditing = customer.address;
    } else {
      this.addressEditing = {};
    }
  }

  dismissModal() {
    this.modal = false;
  }

  async edit() {
    this.customerEditing.address = this.addressEditing;
    this.authService.saveOrUpdateCustomer(this.customerEditing);
    this.getListCustomers();
    this.customerEditing = {};
    this.addressEditing = {};
    this.dismissModal();
  }
}
