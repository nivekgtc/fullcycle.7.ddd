import { Sequelize } from 'sequelize-typescript'

import Address from '../../domain/entity/address'
import Costumer from '../../domain/entity/costumer'
import Order from '../../domain/entity/order'
import OrderItem from '../../domain/entity/order_item'
import Product from '../../domain/entity/product'
import CostumerModel from '../db/sequelize/model/costumer.model'
import OrderItemModel from '../db/sequelize/model/order-item.model'
import OrderModel from '../db/sequelize/model/order.model'
import ProductModel from '../db/sequelize/model/product.model'
import CostumerRepository from './costumer.repository'
import OrderRepository from './order.repository'
import ProductRepository from './product.repository'

describe('Order repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([
      CostumerModel,
      ProductModel,
      OrderModel,
      OrderItemModel
    ])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  // it('Should create a new order', async () => {
  //   const costumerRepository = new CostumerRepository()
  //   const costumer = new Costumer('123', 'Costumer 1')
  //   const address = new Address('Street 1', '123', '', '55555555', 1)
  //   costumer.changeAddress(address)
  //   await costumerRepository.create(costumer)

  //   const productRepository = new ProductRepository()
  //   const product = new Product('1', 'Product 1', 20)
  //   await productRepository.create(product)

  //   const orderItem = new OrderItem(
  //     '123',
  //     product.name,
  //     product.price,
  //     product.id,
  //     2
  //   )

  //   const orderRepository = new OrderRepository()
  //   const order = new Order('1', '1', [orderItem])
  //   // await orderRepository.create(order)

  //   const orderCreated = await OrderModel.create({
  //     id: order.id,
  //     costumer_id: order.costumerId,
  //     // items: [],
  //     total: order.total()
  //   })

  //   console.log(orderCreated)

  //   const orderModel = await OrderModel.findOne({
  //     where: { id: order.id },
  //     include: ['items']
  //   })

  //   expect(orderModel.toJSON()).toStrictEqual({
  //     id: '1',
  //     costumer_id: '1',
  //     total: order.total(),
  //     items: [
  //       {
  //         id: orderItem.id,
  //         name: orderItem.name,
  //         price: orderItem.price,
  //         quantity: orderItem.quantity,
  //         order_id: '1'
  //       }
  //     ]
  //   })
  // })

  it('Should create a new order', async () => {
    const costumerRepository = new CostumerRepository()
    const costumer = new Costumer('123', 'Costumer 1')
    const address = new Address('Street 1', '123', '', '55555555', 1)
    costumer.changeAddress(address)
    await costumerRepository.create(costumer)

    const productRepository = new ProductRepository()
    const product = new Product('1', 'Product 1', 20)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '123',
      product.name,
      product.price,
      product.id,
      2
    )

    const orderRepository = new OrderRepository()
    const order = new Order('1', '123', [orderItem]) // Assuming '123' is the ID of the customer
    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      costumer_id: '123',
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          total: orderItem.orderItemTotal(),
          product_id: '1'
        }
      ]
    })
  })
})
