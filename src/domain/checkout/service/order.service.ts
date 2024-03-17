// import Customer from "../entity/customer";
// import Order from "../entity/order";
// import OrderItem from "../entity/order_item";
import { randomUUID } from 'node:crypto'
import type Customer from '../../customer/entity/customer'
import Order from '../entity/order'
import type OrderItem from '../entity/order_item'

export default class OrderService {
  static placeOrder(customer: Customer, items: OrderItem[]): Order {
    if (items.length === 0) {
      throw new Error('Items are required')
    }

    const uuid = randomUUID()

    const order = new Order(uuid, customer.id, items)
    customer.addRewardPoints(order.total() / 2)
    return order
  }

  static total(orders: Order[]): number {
    return orders.reduce((acc, order) => acc + order.total(), 0)
  }
}
