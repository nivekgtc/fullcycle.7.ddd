import Product from '../../domain/entity/product'
import type ProductRepositoryInterface from '../../domain/repository/product-repository.interface'
import ProductModel from '../db/sequelize/model/product.model'

export default class ProductRepository implements ProductRepositoryInterface {
  async create (entity: Product): Promise<void> {
    await ProductModel.create({
      id: entity.id,
      name: entity.name,
      price: entity.price
    })
  }

  async update (entity: Product): Promise<void> {
    // throw new Error('Method not implemented')
    await ProductModel.update({
      name: entity.name,
      price: entity.price
    }, {
      where: { id: entity.id }
    })
  }

  async findById (id: string): Promise<Product> {
    // throw new Error('Method not implemented')
    const productFinded = await ProductModel.findOne({
      where: { id }
    })

    return new Product(productFinded.id, productFinded.name, productFinded.price)
  }

  async findAll (): Promise<Product[]> {
    // throw new Error('Method not implemented')
    const allProducts = await ProductModel.findAll()
    return allProducts.map(productModel => new Product(productModel.id, productModel.name, productModel.price))
  }
}
