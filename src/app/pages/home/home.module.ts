import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { NgCalendarModule } from 'ionic2-calendar';

import { HomePage } from './home.page';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

export const customCurrencyMaskConfig = {
  align: "left",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgCalendarModule,
    HomePageRoutingModule,
    NgxMaskModule.forRoot(maskConfig),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
