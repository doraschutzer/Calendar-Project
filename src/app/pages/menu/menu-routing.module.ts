import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'service',
        loadChildren: () => import('../service/service.module').then( m => m.ServicePageModule)
      },
      {
        path: 'customer',
        loadChildren: () => import('../customer/customer.module').then( m => m.CustomerPageModule)
      },
      {
        path: 'finance',
        loadChildren: () => import('../finance/finance.module').then( m => m.FinancePageModule)
      },
      {
        path: 'spent',
        loadChildren: () => import('../spent/spent.module').then( m => m.SpentPageModule)
      },
    ]
  },
  // {
  //   path: '',
  //   redirectTo: '/menu/home'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
