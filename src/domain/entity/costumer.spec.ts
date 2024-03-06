import Address from "./address"
import Costumer from "./costumer"

describe("Costumer unit tests", () => {

    it("should get 1 as result", () => {
        const result = 1

        expect(result).toBe(1)
    })

    it('should throw error when id is empty', () => {
        expect(() => {
            let costumer = new Costumer("", "Filho da puta")
        }).toThrowError("Id is required")
    })

    it('should throw error when name is empty', () => {
        expect(() => {
            let costumer = new Costumer("123", "")
        }).toThrowError("Name is required")
    })

    it('should change name', () => {
        expect(() => {
            // Arrange
            let costumer = new Costumer("123", "John")
            // Act
            costumer.changeName("James")
            // Assert
            expect(costumer.name)
        })
    })

    it('should activate costumer', () => {
        expect(() => {
            let costumer = new Costumer("1234", "Costumer 1")
            const address = new Address("Rua 1", "City 1", "State 1", "ZIP 1", 19)

            costumer.Address = address
            
            costumer.activate()
            
            expect(costumer.isActive()).toBe(true)
        })
    })

    it('should deactivate costumer', () => {
        expect(() => {
            let costumer = new Costumer("1234", "Costumer 1")
            const address = new Address("Rua 1", "City 1", "State 1", "ZIP 1", 19)

            costumer.Address = address
            
            costumer.deactivate()
            
            expect(costumer.isActive()).toBe(false)
        })
    })

    it('should throw error when Addres is undefined', () => {
        expect(() => {
            let costumer = new Costumer("1234", "Costumer 1")

            costumer.activate()
            
        }).toThrowError("Address is mandatory to activate a costumer")
    })

})  