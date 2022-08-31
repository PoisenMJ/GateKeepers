import { Address } from "./util/address";

export declare type Order = {
  id: string;
  items: OrderItem[];
  total: string;
  deliveryAddress: Address;
  date: string;
}

export declare type OrderItem = {
  image: string;
  name: string;
  size: string;
  price: string; 
}