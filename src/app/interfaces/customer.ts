export interface Customer {
    id?: number,
    name?: string,
    telephone?: number,
    cellphone?: number,
    addres: {
      state: string,
      city: string,
      street: string,
      neighborhood: string,
      number: number,
    },
    uid?: number
}