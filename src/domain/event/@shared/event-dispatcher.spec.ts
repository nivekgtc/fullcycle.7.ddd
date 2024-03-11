import SendEmailWhenProductIsCreatedHandler from '../product/handler/send-email-when-product-is-created.handler'
import ProductCreatedEvent from '../product/product-created.event'
import EventDispatcher from './event-dispatcher'

describe('Domain events tests', () => {
  it('should register an event', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    const EVENT_NAME = 'ProductCreatedEvent'
    eventDispatcher.register(EVENT_NAME, eventHandler)

    expect(eventDispatcher.getEventHandlers[EVENT_NAME]).toBeDefined()
    expect(eventDispatcher.getEventHandlers[EVENT_NAME].length).toBe(1)

    expect(eventDispatcher.getEventHandlers[EVENT_NAME][0]).toMatchObject(
      eventHandler
    )
  })

  it('should unregister an event', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    const EVENT_NAME = 'ProductCreatedEvent'
    eventDispatcher.register(EVENT_NAME, eventHandler)

    expect(eventDispatcher.getEventHandlers[EVENT_NAME][0]).toMatchObject(
      eventHandler
    )

    eventDispatcher.unregister(EVENT_NAME, eventHandler)

    expect(eventDispatcher.getEventHandlers[EVENT_NAME]).toBeDefined()
    expect(eventDispatcher.getEventHandlers[EVENT_NAME].length).toBe(0)
  })

  it('should unregister all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    const EVENT_NAME = 'ProductCreatedEvent'
    eventDispatcher.register(EVENT_NAME, eventHandler)

    expect(eventDispatcher.getEventHandlers[EVENT_NAME][0]).toMatchObject(
      eventHandler
    )

    eventDispatcher.unregisterAll()

    expect(eventDispatcher.getEventHandlers[EVENT_NAME]).toBeUndefined()
  })

  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()
    const spyOnHandler = jest.spyOn(eventHandler, 'handle')

    const EVENT_NAME = 'ProductCreatedEvent'
    eventDispatcher.register(EVENT_NAME, eventHandler)

    expect(eventDispatcher.getEventHandlers[EVENT_NAME][0]).toMatchObject(
      eventHandler
    )

    const productCreatedEvent = new ProductCreatedEvent({
      name: 'Product 1',
      description: 'Product description',
      price: 20
    })

    eventDispatcher.notify(productCreatedEvent)
    expect(spyOnHandler).toHaveBeenCalled()
  })
})
