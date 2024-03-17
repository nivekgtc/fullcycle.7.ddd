import Order from '../../../../domain/checkout/entity/order'
import OrderItem from '../../../../domain/checkout/entity/order_item'
import type OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repository.interface'
import OrderItemModel from './order-item.model'
import OrderModel from './order.model'

export default class OrderRepository implements OrderRepositoryInterface {
  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({
      include: ['items']
    })

    const mappedOrders = orders.map(order => {
      const orderItems = order.items.map(item => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        )
      })

      return new Order(order.id, order.customer_id, orderItems)
    })

    return mappedOrders
  }

  async update(entity: Order): Promise<void> {
    const existingOrder = await OrderModel.findOne({
      where: { id: entity.id },
      include: ['items']
    })
    if (!existingOrder.id) {
      throw new Error(`Order with ID ${entity.id} not found`)
    }

    existingOrder.customer_id = entity.customerId

    const mappedOrderToModel = {
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        total: item.orderItemTotal(),
        product_id: item.productId,
        quantity: item.quantity
      }))
    }

    for (const updatedItem of entity.items) {
      const existingItem = existingOrder.items.find(
        item => item.id === updatedItem.id
      )

      if (existingItem) {
        existingItem.quantity = updatedItem.quantity

        await existingItem.save()
        return
      }

      await OrderItemModel.create({
        name: updatedItem.name,
        price: updatedItem.price,
        quantity: updatedItem.quantity,
        product_id: updatedItem.productId,
        order_id: existingOrder.id,
        total: updatedItem.orderItemTotal()
      })
    }

    const existingItemIds = existingOrder.items.map(item => item.id)
    const entityItemIds = entity.items.map(item => item.id)

    const itemsToRemove = existingItemIds.filter(
      id => !entityItemIds.includes(id)
    )
    for (const itemId of itemsToRemove) {
      await OrderItemModel.destroy({ where: { id: itemId } })
    }

    await existingOrder.save()
  }

  async find(id: string): Promise<Order> {
    const orderFinded = await OrderModel.findOne({
      where: { id },
      include: ['items']
    })

    const orderItems = orderFinded.items.map(
      item =>
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        )
    )

    const order = new Order(orderFinded.id, orderFinded.customer_id, orderItems)

    return order
  }

  async create(entity: Order): Promise<void> {
    const mappedOrderToModel = {
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        total: item.orderItemTotal(),
        product_id: item.productId,
        quantity: item.quantity
      }))
    }

    console.log({ mappedOrderToModel, items: mappedOrderToModel.items })

    await OrderModel.create(mappedOrderToModel, {
      include: [{ model: OrderItemModel }]
    })
  }

  // async find (id: string): Promise<Customer> {
  //   let customerModel
  //   try {
  //     customerModel = await CustomerModel.findOne({
  //       where: { id },
  //       rejectOnEmpty: true
  //     })
  //   } catch (error) {
  //     throw new Error('Customer not found')
  //   }

  //   const customer = new Customer(id, customerModel.name)
  //   const address = new Address(
  //     customerModel.street,
  //     customerModel.city,
  //     '',
  //     customerModel.zipcode,
  //     customerModel.number
  //   )

  //   customer.changeAddress(address)
  //   return customer
  // }

  // async create (entity: Product): Promise<void> {
  //   await CustomerModel.create({
  //     id: entity.id,
  //     name: entity.name,
  //     active: entity.isActive(),
  //     rewardPoints: entity.rewardPoints,
  //     street: entity.Address.street,
  //     number: entity.Address.number,
  //     zipcode: entity.Address.zip,
  //     city: entity.Address.city
  //   })
  // }

  // async update (entity: Customer): Promise<void> {
  //   // throw new Error('Method not implemented')
  //   await CustomerModel.update(
  //     {
  //       name: entity.name,
  //       ...entity
  //     },
  //     {
  //       where: { id: entity.id }
  //     }
  //   )
  // }

  // async findById (id: string): Promise<Customer> {
  //   const customerFinded = await CustomerModel.findOne({
  //     where: { id }
  //   })

  //   return new Customer(customerFinded.id, customerFinded.name)
  // }

  // async findAll (): Promise<Customer[]> {
  //   const allCustomers = await CustomerModel.findAll()
  //   return allCustomers.map(customerModel => {
  //     const customer = new Customer(customerModel.id, customerModel.name)
  //     customer.addRewardPoints(customerModel.rewardPoints)
  //     const address = new Address(
  //       customerModel.street,
  //       customerModel.city,
  //       '',
  //       customerModel.zipcode,
  //       customerModel.number
  //     )
  //     customer.changeAddress(address)

  //     if (customerModel.active) {
  //       customer.activate()
  //     }

  //     return customer
  //   })
  // }
}
