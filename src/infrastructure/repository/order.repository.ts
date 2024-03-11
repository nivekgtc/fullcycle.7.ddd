import type Order from '../../domain/entity/order'
import type OrderRepositoryInterface from '../../domain/repository/order-repository.interface'
import OrderItemModel from '../db/sequelize/model/order-item.model'
import OrderModel from '../db/sequelize/model/order.model'

export default class OrderRepository implements OrderRepositoryInterface {
  update: (entity: Order) => Promise<void>
  find: (id: string) => Promise<Order>
  findAll: () => Promise<Order[]>
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
