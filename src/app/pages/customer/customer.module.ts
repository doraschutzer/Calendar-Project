import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomerPageRoutingModule } from './customer-routing.module';
import { CustomerPage } from './customer.page';
import { NgxMaskIonicModule } from 'ngx-mask-ionic';
import { IConfig } from 'ngx-mask';
import { PipeModule } from '../../../app/pipe/pipe.module';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerPageRoutingModule,
    NgxMaskIonicModule.forRoot(maskConfig),
    PipeModule
  ],
  declarations: [CustomerPage]
})
export class CustomerPageModule {}
