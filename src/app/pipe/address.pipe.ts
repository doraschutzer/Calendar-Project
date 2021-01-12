import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../interfaces/address';

@Pipe({
  name: 'addresspipe'
})
export class AddressPipe implements PipeTransform {

  transform(value: Address): string {
    console.log("value", value)
    if(!value){
      return "";
    }
    var retorno = null;

    if(value.street){
      retorno = value.street;
    }

    if(value.city){
      retorno = retorno ? retorno + ` - ${value.city}` : value.city;
      retorno = value.state ? retorno + `(${value.state})` : retorno;
    }
    return retorno ? retorno : "";
  }

}
