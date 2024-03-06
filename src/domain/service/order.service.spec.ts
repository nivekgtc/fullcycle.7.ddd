import Costumer from "../entity/costumer"
import Order from "../entity/order"
import OrderItem from "../entity/order_item"
import OrderService from "./order.service"

import { randomUUID as uuid} from 'node:crypto'

describe("OrderService unit tests", () => {

    it('should place an order', () => {

        const customer = new Costumer("c1", "Customer 1")
        const item1 = new OrderItem("1", "Item 1", 10, "p1", 1)
        
        const order = OrderService.placeOrder(customer, [item1])

        expect(customer.rewardPoints).toBe(5)
        expect(order.total()).toBe(10)
    })

    it('Should get total sum of all orders', () => {
        const orderItem = new OrderItem("1", "P1", 100, "p1", 1)
        const orderItem2 = new OrderItem("2", "P2", 150, "p2", 2)

        const order = new Order('o1', 'c1', [orderItem])
        const order2 = new Order('o2', 'c1', [orderItem2])
        
        const total = OrderService.total([order, order2])

        expect(total).toBe(400)
    })

    it('should add reward points', () => {
        const customer = new Costumer(uuid(), 'Costumer')
        expect(customer.rewardPoints).toBe(0)

        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(10)

        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(20)
    })
})