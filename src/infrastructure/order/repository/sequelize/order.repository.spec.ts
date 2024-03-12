import { Sequelize } from 'sequelize-typescript'

import Order from '../../../../domain/checkout/entity/order'
import OrderItem from '../../../../domain/checkout/entity/order_item'
import Costumer from '../../../../domain/costumer/entity/costumer'
import Address from '../../../../domain/costumer/value-object/address'
import Product from '../../../../domain/product/entity/product'
import CostumerModel from '../../../costumer/repository/sequelize/costumer.model'
import CostumerRepository from '../../../costumer/repository/sequelize/costumer.repository'
import ProductModel from '../../../product/repository/sequelize/product.model'
import ProductRepository from '../../../product/repository/sequelize/product.repository'
import OrderItemModel from './order-item.model'
import OrderModel from './order.model'
import OrderRepository from './order.repository'

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
    const order = new Order('1', '123', [orderItem])
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

  it('Should find a created order', async () => {
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
    const order = new Order('1', '123', [orderItem])
    await orderRepository.create(order)

    const foundOrder = await orderRepository.find(order.id)

    expect(foundOrder).toBeDefined()
    expect(foundOrder.id).toBe(order.id)
    expect(foundOrder.costumerId).toBe(order.costumerId)
    expect(foundOrder.items.length).toBe(1)

    const foundOrderItem = foundOrder.items[0]
    expect(foundOrderItem.id).toBe(orderItem.id)
    expect(foundOrderItem.name).toBe(orderItem.name)
    expect(foundOrderItem.price).toBe(orderItem.price)
    expect(foundOrderItem.quantity).toBe(orderItem.quantity)
  })

  it('Should update an existing order', async () => {
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
    let order = new Order('1', '123', [orderItem])
    await orderRepository.create(order)

    const newOrderItemQuantity = 3
    order = new Order('1', '123', [
      new OrderItem(
        '123',
        product.name,
        product.price,
        product.id,
        newOrderItemQuantity
      )
    ])
    await orderRepository.update(order)

    const updatedOrder = await orderRepository.find(order.id)

    expect(updatedOrder).toBeDefined()
    expect(updatedOrder.items.length).toBe(1)
    expect(updatedOrder.items[0].quantity).toBe(newOrderItemQuantity)
  })

  it('Should find all orders', async () => {
    const costumerRepository = new CostumerRepository()
    const productRepository = new ProductRepository()
    const orderRepository = new OrderRepository()

    const costumer1 = new Costumer('1', 'Costumer 1')
    const address1 = new Address('Street 1', '123', '', '55555555', 1)
    costumer1.changeAddress(address1)
    await costumerRepository.create(costumer1)

    const costumer2 = new Costumer('2', 'Costumer 2')
    const address2 = new Address('Street 2', '456', '', '66666666', 2)
    costumer2.changeAddress(address2)
    await costumerRepository.create(costumer2)

    const product1 = new Product('1', 'Product 1', 20)
    await productRepository.create(product1)

    const product2 = new Product('2', 'Product 2', 30)
    await productRepository.create(product2)

    const orderItem1 = new OrderItem(
      '1',
      product1.name,
      product1.price,
      product1.id,
      2
    )
    const orderItem2 = new OrderItem(
      '2',
      product2.name,
      product2.price,
      product2.id,
      3
    )

    const order1 = new Order('1', costumer1.id, [orderItem1])
    await orderRepository.create(order1)

    const order2 = new Order('2', costumer2.id, [orderItem2])
    await orderRepository.create(order2)

    const allOrders = await orderRepository.findAll()

    expect(allOrders.length).toBe(2)

    const order1Found = allOrders.find(order => order.id === order1.id)
    expect(order1Found).toBeDefined()
    expect(order1Found?.costumerId).toBe(costumer1.id)
    expect(order1Found?.items.length).toBe(1)

    const order2Found = allOrders.find(order => order.id === order2.id)
    expect(order2Found).toBeDefined()
    expect(order2Found?.costumerId).toBe(costumer2.id)
    expect(order2Found?.items.length).toBe(1)
  })
})
