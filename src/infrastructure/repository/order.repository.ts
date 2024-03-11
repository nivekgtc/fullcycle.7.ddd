import Order from '../../domain/entity/order'
import OrderItem from '../../domain/entity/order_item'
import type OrderRepositoryInterface from '../../domain/repository/order-repository.interface'
import OrderItemModel from '../db/sequelize/model/order-item.model'
import OrderModel from '../db/sequelize/model/order.model'

export default class OrderRepository implements OrderRepositoryInterface {
  async findAll (): Promise<Order[]> {
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

      return new Order(order.id, order.costumer_id, orderItems)
    })

    return mappedOrders
  }

  async update (entity: Order): Promise<void> {
    const existingOrder = await OrderModel.findOne({
      where: { id: entity.id },
      include: ['items']
    })
    if (!existingOrder.id) {
      throw new Error(`Order with ID ${order.id} not found`)
    }

    existingOrder.costumer_id = entity.costumerId

    const mappedOrderToModel = {
      id: entity.id,
      costumer_id: entity.costumerId,
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

  async find (id: string): Promise<Order> {
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

    const order = new Order(orderFinded.id, orderFinded.costumer_id, orderItems)

    return order
  }

  async create (entity: Order): Promise<void> {
    const mappedOrderToModel = {
      id: entity.id,
      costumer_id: entity.costumerId,
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

  // async find (id: string): Promise<Costumer> {
  //   let costumerModel
  //   try {
  //     costumerModel = await CostumerModel.findOne({
  //       where: { id },
  //       rejectOnEmpty: true
  //     })
  //   } catch (error) {
  //     throw new Error('Costumer not found')
  //   }

  //   const costumer = new Costumer(id, costumerModel.name)
  //   const address = new Address(
  //     costumerModel.street,
  //     costumerModel.city,
  //     '',
  //     costumerModel.zipcode,
  //     costumerModel.number
  //   )

  //   costumer.changeAddress(address)
  //   return costumer
  // }

  // async create (entity: Product): Promise<void> {
  //   await CostumerModel.create({
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

  // async update (entity: Costumer): Promise<void> {
  //   // throw new Error('Method not implemented')
  //   await CostumerModel.update(
  //     {
  //       name: entity.name,
  //       ...entity
  //     },
  //     {
  //       where: { id: entity.id }
  //     }
  //   )
  // }

  // async findById (id: string): Promise<Costumer> {
  //   const costumerFinded = await CostumerModel.findOne({
  //     where: { id }
  //   })

  //   return new Costumer(costumerFinded.id, costumerFinded.name)
  // }

  // async findAll (): Promise<Costumer[]> {
  //   const allCostumers = await CostumerModel.findAll()
  //   return allCostumers.map(costumerModel => {
  //     const costumer = new Costumer(costumerModel.id, costumerModel.name)
  //     costumer.addRewardPoints(costumerModel.rewardPoints)
  //     const address = new Address(
  //       costumerModel.street,
  //       costumerModel.city,
  //       '',
  //       costumerModel.zipcode,
  //       costumerModel.number
  //     )
  //     costumer.changeAddress(address)

  //     if (costumerModel.active) {
  //       costumer.activate()
  //     }

  //     return costumer
  //   })
  // }
}
