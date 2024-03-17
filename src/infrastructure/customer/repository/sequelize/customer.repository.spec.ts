import { Sequelize } from 'sequelize-typescript'

import { randomUUID } from 'node:crypto'
import Customer from '../../../../domain/customer/entity/customer'
import Address from '../../../../domain/customer/value-object/address'
import CustomerModel from './customer.model'
import CustomerRepository from './customer.repository'

describe('Customer repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([CustomerModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a customer', async () => {
    const id = randomUUID()
    const address = new Address('123 Main St', 'City', 'State', '12345', 1)

    const customerRepository = new CustomerRepository()
    const customer = new Customer(id, 'John Doe')
    customer.Address = address
    customer.activate()

    await customerRepository.create(customer)

    const customerModel = await CustomerModel.findOne({ where: { id } })

    expect(customerModel.toJSON()).toStrictEqual({
      id,
      name: 'John Doe',
      active: customer.isActive(),
      rewardPoints: 0,
      street: '123 Main St',
      number: 1,
      city: 'City',
      zipcode: '12345'
    })
  })

  it('should update a customer', async () => {
    const id = randomUUID()
    const address = new Address('123 Main St', 'City', 'State', '12345', 1)

    const customerRepository = new CustomerRepository()
    const customer = new Customer(id, 'John Doe')
    customer.Address = address
    customer.activate()

    await customerRepository.create(customer)

    const NEW_COSTUMER_NAME = 'Jane Smith'
    customer.changeName(NEW_COSTUMER_NAME)

    await customerRepository.update(customer)

    const customerModelModified = await CustomerModel.findOne({
      where: { id }
    })

    expect(customerModelModified.toJSON()).toStrictEqual({
      id,
      name: NEW_COSTUMER_NAME,
      active: customer.isActive(),
      rewardPoints: 0,
      street: '123 Main St',
      number: 1,
      city: 'City',
      zipcode: '12345'
    })
  })

  it('should find a customer', async () => {
    const customerRepository = new CustomerRepository()
    const id = randomUUID()
    const address = new Address('123 Main St', 'City', 'State', '12345', 1)

    const customer = new Customer(id, 'John Doe')
    customer.Address = address
    customer.activate()

    await customerRepository.create(customer)

    const customerModel = await CustomerModel.findOne({
      where: { id }
    })

    expect(customerModel.toJSON()).toStrictEqual({
      id,
      name: 'John Doe',
      active: customer.isActive(),
      rewardPoints: 0,
      street: '123 Main St',
      number: 1,
      city: 'City',
      zipcode: '12345'
    })
  })

  it('should throw error when customer is not found', async () => {
    const customerRepository = new CustomerRepository()

    expect(async () => {
      await customerRepository.find('NOT_FOUND_ID')
    }).rejects.toThrow('Customer not found')
  })

  it('should find all customers', async () => {
    const customerRepository = new CustomerRepository()

    const customer1 = new Customer(randomUUID(), 'John Doe')
    customer1.Address = new Address('123 Main St', 'City', 'State', '12345', 1)
    customer1.activate()
    await customerRepository.create(customer1)

    const customer2 = new Customer(randomUUID(), 'Jane Smith')
    customer2.Address = new Address('456 Elm St', 'City', 'State', '54321', 2)
    customer2.activate()
    await customerRepository.create(customer2)

    const customer3 = new Customer(randomUUID(), 'Alice Johnson')
    customer3.Address = new Address('789 Oak St', 'City', 'State', '98765', 3)
    customer3.activate()
    await customerRepository.create(customer3)

    const allCustomers = await customerRepository.findAll()

    expect(allCustomers.length).toBe(3)
    expect(allCustomers[0]).toBeInstanceOf(Customer)
    expect(allCustomers[1]).toBeInstanceOf(Customer)
    expect(allCustomers[2]).toBeInstanceOf(Customer)

    expect(allCustomers[0].name).toBe('John Doe')
    expect(allCustomers[1].name).toBe('Jane Smith')
    expect(allCustomers[2].name).toBe('Alice Johnson')
  })
})
