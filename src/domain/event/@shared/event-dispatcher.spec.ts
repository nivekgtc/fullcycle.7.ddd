import SendEmailWhenProductIsCreatedHandler from '../product/handler/send-email-when-product-is-created.handler'
import EventDispatcher from './event-dispatcher'

describe('Domain events tests', () => {
  it('should register an event', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductIsCreatedHandler()

    const EVENT_NAME = 'ProductCreatedEvent'
    eventDispatcher.register(EVENT_NAME, eventHandler)

    expect(eventDispatcher.getEventHandlers[EVENT_NAME]).toBeDefined()
    expect(eventDispatcher.getEventHandlers[EVENT_NAME].length).toBe(1)
  })
})
