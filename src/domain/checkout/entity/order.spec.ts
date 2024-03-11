import Order from "./order"
import OrderItem from "./order_item"

describe("Order unit tests", () => {



    it('should throw error when id is empty', () => {
        expect(() => {
            let order = new Order("", "123", [])
        }).toThrowError("Id is required")
    })

    it('should throw error when id is empty', () => {
        expect(() => {
            let order = new Order("123", "", [])
        }).toThrowError("CostumerId is required")
    })

    it('should throw error when id is empty', () => {
        expect(() => {
            let order = new Order("123", "123", [])
        }).toThrowError("Item qtd must be greater than zero")
    })

    
    it('should calculate total', () => {
       const item = new OrderItem('1', 'Item 1', 100, "p1", 2)
       const item2 = new OrderItem('1', 'Item 1', 200, "p2", 2)

       const order = new Order("1", "1", [item])

       const total = order.total()

       expect(total).toBe(200)

       const order2 = new Order("1", "1", [item, item2])
       const total2 = order2.total()

       expect(total2).toBe(600)

    })

    it('should throw error if the item quantity is less or equal zero', () => {
       
        expect(() => {
            const item = new OrderItem('1', 'Item 1', 100, "p1", 0)
 
            const order = new Order("1", "1", [item])
        }).toThrowError("Quantity must be greater than zero")
     })

    
})  