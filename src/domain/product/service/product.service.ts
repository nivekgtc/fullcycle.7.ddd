// import Product from "../entity/product";

import type Product from '../entity/product'

export default class ProductService {
  static increasePrice (
    products: Product[],
    percentage: number
  ): Product[] | void {
    products.forEach(product => {
      product.changePrice((product.price * percentage) / 100 + product.price)
    })

    return products
  }
}
