// import Address from './domain/costumer/entity/address'
import Costumer from './domain/costumer/entity/costumer'
import Address from './domain/costumer/value-object/address'

const costumer = new Costumer('123', 'Kevin Cavalcanti')
const address = new Address('Rua dois', 'XX', 'Inferno', '53333-100', 1)
costumer.Address = address
costumer.activate()

// const item1 = new OrderItem('123', "xx", 12)
// const item2 = new OrderItem('12', "xxx", 30)

// const order = new Order("1", costumer._id, [item1, item2])
