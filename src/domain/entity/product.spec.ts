import Order from "./order"
import Product from "./product"

describe("Product unit tests", () => {

    it('should throw error when id is empty', () => {
        expect(() => {
            let product1 = new Product("", "Product 1", 100)

        }).toThrowError("Id is required")
    })

    it('should throw error when name is empty', () => {
        expect(() => {
            let product1 = new Product("1", "", 12)

        }).toThrowError("Name is required")
    })

    it('should throw error when price is less than zero', () => {
        expect(() => {
            let product1 = new Product("1", "120", -12)

        }).toThrowError("Price must be greater than zero")
    })

    it('should change name', () => {
        let product1 = new Product("1", "120", 112)
        product1.changeName("Product 2")
        expect(product1.name).toBe('Product 2')
    })
    it('should change price', () => {
        let product1 = new Product("1", "120", 112)
        product1.changePrice(150)
        expect(product1.price).toBe(150)
    })

})  