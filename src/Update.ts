import { Product } from './Products';
export type Update = Partial<Omit<Product, 'id'>>;