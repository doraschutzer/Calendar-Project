import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';

import { FinancePage } from './finance.page';

export const customCurrencyMaskConfig = {
  align: "right",
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

const routes: Routes = [
  {
    path: '',
    component: FinancePage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  exports: [RouterModule],
})
export class FinancePageRoutingModule {}
