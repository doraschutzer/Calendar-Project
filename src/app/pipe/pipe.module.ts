import { NgModule } from '@angular/core';
import { AddressPipe } from './address.pipe';

@NgModule({
  imports: [],
  declarations: [AddressPipe],
  exports: [AddressPipe]
})
export class PipeModule {}
