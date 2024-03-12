import { Sequelize } from 'sequelize-typescript'

import { randomUUID } from 'node:crypto'
import Costumer from '../../../../domain/costumer/entity/costumer'
import Address from '../../../../domain/costumer/value-object/address'
import CostumerModel from './costumer.model'
import CostumerRepository from './costumer.repository'

describe('Costumer repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([CostumerModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a costumer', async () => {
    const id = randomUUID()
    const address = new Address('123 Main St', 'City', 'State', '12345', 1)

    const costumerRepository = new CostumerRepository()
    const costumer = new Costumer(id, 'John Doe')
    costumer.Address = address
    costumer.activate()

    await costumerRepository.create(costumer)

    const costumerModel = await CostumerModel.findOne({ where: { id } })

    expect(costumerModel.toJSON()).toStrictEqual({
      id,
      name: 'John Doe',
      active: costumer.isActive(),
      rewardPoints: 0,
      street: '123 Main St',
      number: 1,
      city: 'City',
      zipcode: '12345'
    })
  })

  it('should update a costumer', async () => {
    const id = randomUUID()
    const address = new Address('123 Main St', 'City', 'State', '12345', 1)

    const costumerRepository = new CostumerRepository()
    const costumer = new Costumer(id, 'John Doe')
    costumer.Address = address
    costumer.activate()

    await costumerRepository.create(costumer)

    const NEW_COSTUMER_NAME = 'Jane Smith'
    costumer.changeName(NEW_COSTUMER_NAME)

    await costumerRepository.update(costumer)

    const costumerModelModified = await CostumerModel.findOne({
      where: { id }
    })

    expect(costumerModelModified.toJSON()).toStrictEqual({
      id,
      name: NEW_COSTUMER_NAME,
      active: costumer.isActive(),
      rewardPoints: 0,
      street: '123 Main St',
      number: 1,
      city: 'City',
      zipcode: '12345'
    })
  })

  it('should find a costumer', async () => {
    const costumerRepository = new CostumerRepository()
    const id = randomUUID()
    const address = new Address('123 Main St', 'City', 'State', '12345', 1)

    const costumer = new Costumer(id, 'John Doe')
    costumer.Address = address
    costumer.activate()

    await costumerRepository.create(costumer)

    const costumerModel = await CostumerModel.findOne({
      where: { id }
    })

    expect(costumerModel.toJSON()).toStrictEqual({
      id,
      name: 'John Doe',
      active: costumer.isActive(),
      rewardPoints: 0,
      street: '123 Main St',
      number: 1,
      city: 'City',
      zipcode: '12345'
    })
  })

  it('should throw error when costumer is not found', async () => {
    const costumerRepository = new CostumerRepository()

    expect(async () => {
      await costumerRepository.find('NOT_FOUND_ID')
    }).rejects.toThrow('Costumer not found')
  })

  it('should find all costumers', async () => {
    const costumerRepository = new CostumerRepository()

    const costumer1 = new Costumer(randomUUID(), 'John Doe')
    costumer1.Address = new Address('123 Main St', 'City', 'State', '12345', 1)
    costumer1.activate()
    await costumerRepository.create(costumer1)

    const costumer2 = new Costumer(randomUUID(), 'Jane Smith')
    costumer2.Address = new Address('456 Elm St', 'City', 'State', '54321', 2)
    costumer2.activate()
    await costumerRepository.create(costumer2)

    const costumer3 = new Costumer(randomUUID(), 'Alice Johnson')
    costumer3.Address = new Address('789 Oak St', 'City', 'State', '98765', 3)
    costumer3.activate()
    await costumerRepository.create(costumer3)

    const allCostumers = await costumerRepository.findAll()

    expect(allCostumers.length).toBe(3)
    expect(allCostumers[0]).toBeInstanceOf(Costumer)
    expect(allCostumers[1]).toBeInstanceOf(Costumer)
    expect(allCostumers[2]).toBeInstanceOf(Costumer)

    expect(allCostumers[0].name).toBe('John Doe')
    expect(allCostumers[1].name).toBe('Jane Smith')
    expect(allCostumers[2].name).toBe('Alice Johnson')
  })
})
