import EventDispatcher from '../../../@shared/event/event-dispatcher'
import Customer from '../../entity/customer'
import Address from '../../value-object/address'
import CustomerCreatedEvent from './customer-created.event'
import CustomerUpdatedAddressEvent from './customer-updated-address.event'
import SendLogOneWhenCustomerCreatedHandler from './handler/send-log-one-when-customer-created.handler'
import SendLogTwoWhenCustomerCreatedHandler from './handler/send-log-two-when-customer-created.handler'
import SendLogWhenUpdatedAddressHandler from './handler/send-log-when-updated-address.handler'

describe('Customer event handlers', () => {
  it('should create and bind event handlers and notify when Customer Created', () => {
    const eventDispatcher = new EventDispatcher()
    const sendLogOneWhenCustomerCreatedHandler =
      new SendLogOneWhenCustomerCreatedHandler()
    const sendLogTwoWhenCustomerCreatedHandler =
      new SendLogTwoWhenCustomerCreatedHandler()

    const EVENT_NAME = 'CustomerCreatedEvent'

    const [spyOnSendLogOne, spyOnSendLogTwo] = [
      jest.spyOn(sendLogOneWhenCustomerCreatedHandler, 'handle'),
      jest.spyOn(sendLogTwoWhenCustomerCreatedHandler, 'handle')
    ]

    eventDispatcher.register(EVENT_NAME, sendLogOneWhenCustomerCreatedHandler)
    eventDispatcher.register(EVENT_NAME, sendLogTwoWhenCustomerCreatedHandler)

    expect(eventDispatcher.getEventHandlers[EVENT_NAME][0]).toMatchObject(
      sendLogOneWhenCustomerCreatedHandler
    )
    expect(eventDispatcher.getEventHandlers[EVENT_NAME][1]).toMatchObject(
      sendLogTwoWhenCustomerCreatedHandler
    )

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: 'Customer name'
    })

    eventDispatcher.notify(customerCreatedEvent)

    expect(spyOnSendLogOne).toHaveBeenCalled()
    expect(spyOnSendLogTwo).toHaveBeenCalled()
  })

  it('should notify when customer change address', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendLogWhenUpdatedAddressHandler()
    const spyOnEventHandler = jest.spyOn(eventHandler, 'handle')

    const EVENT_NAME = 'CustomerUpdatedAddressEvent'

    eventDispatcher.register(EVENT_NAME, eventHandler)

    expect(eventDispatcher.getEventHandlers[EVENT_NAME][0]).toMatchObject(
      eventHandler
    )
    const customer = new Customer('1', 'Customer 1')

    const newAddress = new Address('Street 1', 'City 1', '', '5555555', 1)
    customer.changeAddress(newAddress)

    // const customerUpdatedEvent = new CustomerUpdatedEvent(newAddress)
    const customerUpdatedAddressEvent = new CustomerUpdatedAddressEvent(newAddress)

    eventDispatcher.notify(customerUpdatedAddressEvent)

    expect(spyOnEventHandler).toHaveBeenCalled()
  })
})
