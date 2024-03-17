import Customer from '../../../../domain/customer/entity/customer'
import type CustomerRepositoryInterface from '../../../../domain/customer/repository/customer-repository.interface'
import Address from '../../../../domain/customer/value-object/address'
import CustomerModel from './customer.model'

export default class CustomerRepository implements CustomerRepositoryInterface {
  async find(id: string): Promise<Customer> {
    let customerModel
    try {
      customerModel = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: true
      })
    } catch (error) {
      throw new Error('Customer not found')
    }

    const customer = new Customer(id, customerModel.name)
    const address = new Address(
      customerModel.street,
      customerModel.city,
      '',
      customerModel.zipcode,
      customerModel.number
    )

    customer.changeAddress(address)
    return customer
  }

  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
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

  async update(entity: Customer): Promise<void> {
    // throw new Error('Method not implemented')
    await CustomerModel.update(
      {
        name: entity.name,
        ...entity
      },
      {
        where: { id: entity.id }
      }
    )
  }

  async findById(id: string): Promise<Customer> {
    const customerFinded = await CustomerModel.findOne({
      where: { id }
    })

    return new Customer(customerFinded.id, customerFinded.name)
  }

  async findAll(): Promise<Customer[]> {
    const allCustomers = await CustomerModel.findAll()
    return allCustomers.map(customerModel => {
      const customer = new Customer(customerModel.id, customerModel.name)
      customer.addRewardPoints(customerModel.rewardPoints)
      const address = new Address(
        customerModel.street,
        customerModel.city,
        '',
        customerModel.zipcode,
        customerModel.number
      )
      customer.changeAddress(address)

      if (customerModel.active) {
        customer.activate()
      }

      return customer
    })
  }
}
