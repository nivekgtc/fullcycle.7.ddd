import Address from '../value-object/address'
import Customer from './customer'

describe('Customer unit tests', () => {
  it('should get 1 as result', () => {
    const result = 1

    expect(result).toBe(1)
  })

  it('should throw error when id is empty', () => {
    expect(() => {
      const customer = new Customer('', 'Filho da puta')
    }).toThrowError('Id is required')
  })

  it('should throw error when name is empty', () => {
    expect(() => {
      const customer = new Customer('123', '')
    }).toThrowError('Name is required')
  })

  it('should change name', () => {
    expect(() => {
      // Arrange
      const customer = new Customer('123', 'John')
      // Act
      customer.changeName('James')
      // Assert
      expect(customer.name)
    })
  })

  it('should activate customer', () => {
    expect(() => {
      const customer = new Customer('1234', 'Customer 1')
      const address = new Address('Rua 1', 'City 1', 'State 1', 'ZIP 1', 19)

      customer.Address = address

      customer.activate()

      expect(customer.isActive()).toBe(true)
    })
  })

  it('should deactivate customer', () => {
    expect(() => {
      const customer = new Customer('1234', 'Customer 1')
      const address = new Address('Rua 1', 'City 1', 'State 1', 'ZIP 1', 19)

      customer.Address = address

      customer.deactivate()

      expect(customer.isActive()).toBe(false)
    })
  })

  it('should throw error when Addres is undefined', () => {
    expect(() => {
      const customer = new Customer('1234', 'Customer 1')

      customer.activate()
    }).toThrowError('Address is mandatory to activate a customer')
  })
})
