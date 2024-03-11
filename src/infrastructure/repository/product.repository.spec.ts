import { Sequelize } from 'sequelize-typescript'
import ProductModel from '../db/sequelize/model/product.model'

import { randomUUID } from 'node:crypto'
import Product from '../../domain/entity/product'
import ProductRepository from './product.repository'

describe('Product repository test', () => {
  let sqlizz: Sequelize

  beforeEach(async () => {
    sqlizz = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sqlizz.addModels([ProductModel])
    await sqlizz.sync()
  })

  afterEach(async () => {
    await sqlizz.close()
  })

  it('should create product', async () => {
    const id = randomUUID()

    const productRepository = new ProductRepository()
    const product = new Product(id, 'Product 1', 100)

    await productRepository.create(product)

    const productModel = await ProductModel.findOne({ where: { id } })

    expect(productModel.toJSON()).toStrictEqual({
      id,
      name: 'Product 1',
      price: 100
    })
  })

  it('should update a product', async () => {
    const id = randomUUID()

    const productRepository = new ProductRepository()
    const product = new Product(id, 'Product 1', 100)

    await productRepository.create(product)

    const productModel = await ProductModel.findOne({ where: { id } })

    expect(productModel.toJSON()).toStrictEqual({
      id,
      name: 'Product 1',
      price: 100
    })

    const NEW_PRODUCT_NAME = 'newProductName'
    product.changeName(NEW_PRODUCT_NAME)

    await productRepository.update(product)

    const productModelModified = await ProductModel.findOne({
      where: { id }
    })

    expect(productModelModified).toStrictEqual({
      id,
      name: NEW_PRODUCT_NAME,
      price: 100
    })
  })

  it('should find a product', async () => {
    const productRepository = new ProductRepository()
    const id = randomUUID()
    const product = new Product(id, 'Novo produto', 25)

    await productRepository.create(product)

    const productModel = await ProductModel.findOne({
      where: { id }
    })

    expect(productModel.toJSON()).toStrictEqual({
      id,
      name: 'Novo produto',
      price: 25
    })
  })
})
