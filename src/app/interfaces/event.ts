import { Customer } from 'src/app/interfaces/customer';

export interface Event {
  id?: String,
  title?: String,
  startTime?: any,
  endTime?: any,
  customer?: Customer,
  services?: any,
  total?: number,
  uid?: String,
  paid?: any,
  confirm?: boolean;
};