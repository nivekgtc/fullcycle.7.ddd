import Address from '../../domain/entity/address'
import type Product from '../../domain/entity/costumer'
import Costumer from '../../domain/entity/costumer'
import type CostumerRepositoryInterface from '../../domain/repository/costumer-repository.interface'
import CostumerModel from '../db/sequelize/model/costumer.model'

export default class CostumerRepository implements CostumerRepositoryInterface {
  async find (id: string): Promise<Costumer> {
    let costumerModel
    try {
      costumerModel = await CostumerModel.findOne({
        where: { id },
        rejectOnEmpty: true
      })
    } catch (error) {
      throw new Error('Costumer not found')
    }

    const costumer = new Costumer(id, costumerModel.name)
    const address = new Address(
      costumerModel.street,
      costumerModel.city,
      '',
      costumerModel.zipcode,
      costumerModel.number
    )

    costumer.changeAddress(address)
    return costumer
  }

  async create (entity: Product): Promise<void> {
    await CostumerModel.create({
      id: entity.id,
      name: entity.name,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
      street: entity.Address.street,
      number: entity.Address.number,
      zipcode: entity.Address.zip,
      city: entity.Address.city
    })
  }

  async update (entity: Costumer): Promise<void> {
    // throw new Error('Method not implemented')
    await CostumerModel.update(
      {
        name: entity.name,
        ...entity
      },
      {
        where: { id: entity.id }
      }
    )
  }

  async findById (id: string): Promise<Costumer> {
    const costumerFinded = await CostumerModel.findOne({
      where: { id }
    })

    return new Costumer(costumerFinded.id, costumerFinded.name)
  }

  async findAll (): Promise<Costumer[]> {
    const allCostumers = await CostumerModel.findAll()
    return allCostumers.map(costumerModel => {
      const costumer = new Costumer(costumerModel.id, costumerModel.name)
      costumer.addRewardPoints(costumerModel.rewardPoints)
      const address = new Address(
        costumerModel.street,
        costumerModel.city,
        '',
        costumerModel.zipcode,
        costumerModel.number
      )
      costumer.changeAddress(address)

      if (costumerModel.active) {
        costumer.activate()
      }

      return costumer
    })
  }
}