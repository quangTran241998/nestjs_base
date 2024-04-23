import { Injectable } from '@nestjs/common';
import { Product } from 'src/module/product.model';

@Injectable()
export class ProductsService {
  private readonly product: Product[] = [];

  findAll(): Product[] {
    return this.product;
  }

  create(product: Product) {
    this.product.push(product);
  }
}
