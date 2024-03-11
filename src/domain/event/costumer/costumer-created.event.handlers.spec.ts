import Address from '../../entity/address'
import Costumer from '../../entity/costumer'
import EventDispatcher from '../@shared/event-dispatcher'
import CostumerCreatedEvent from './costumer-created.event'
import CostumerUpdatedEvent from './costumer-updated.event'
import SendLogOneWhenCostumerCreatedHandler from './handler/send-log-one-when-costumer-created.handler'
import SendLogTwoWhenCostumerCreatedHandler from './handler/send-log-two-when-costumer-created.handler'
import SendLogWhenUpdatedAddressHandler from './handler/send-log-when-updated-address.handler'

describe('Costumer event handlers', () => {
  it('should create and bind event handlers and notify when Costumer Created', () => {
    const eventDispatcher = new EventDispatcher()
    const sendLogOneWhenCostumerCreatedHandler =
      new SendLogOneWhenCostumerCreatedHandler()
    const sendLogTwoWhenCostumerCreatedHandler =
      new SendLogTwoWhenCostumerCreatedHandler()

    const EVENT_NAME = 'CostumerCreatedEvent'

    const [spyOnSendLogOne, spyOnSendLogTwo] = [
      jest.spyOn(sendLogOneWhenCostumerCreatedHandler, 'handle'),
      jest.spyOn(sendLogTwoWhenCostumerCreatedHandler, 'handle')
    ]

    eventDispatcher.register(EVENT_NAME, sendLogOneWhenCostumerCreatedHandler)
    eventDispatcher.register(EVENT_NAME, sendLogTwoWhenCostumerCreatedHandler)

    expect(eventDispatcher.getEventHandlers[EVENT_NAME][0]).toMatchObject(
      sendLogOneWhenCostumerCreatedHandler
    )
    expect(eventDispatcher.getEventHandlers[EVENT_NAME][1]).toMatchObject(
      sendLogTwoWhenCostumerCreatedHandler
    )

    const costumerCreatedEvent = new CostumerCreatedEvent({
      name: 'Costumer name'
    })

    eventDispatcher.notify(costumerCreatedEvent)

    expect(spyOnSendLogOne).toHaveBeenCalled()
    expect(spyOnSendLogTwo).toHaveBeenCalled()
  })

  it('should notify when costumer change address', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendLogWhenUpdatedAddressHandler()
    const spyOnEventHandler = jest.spyOn(eventHandler, 'handle')

    const EVENT_NAME = 'CostumerUpdatedEvent'

    eventDispatcher.register(EVENT_NAME, eventHandler)

    expect(eventDispatcher.getEventHandlers[EVENT_NAME][0]).toMatchObject(
      eventHandler
    )
    const costumer = new Costumer('1', 'Costumer 1')

    const newAddress = new Address('Street 1', 'City 1', '', '5555555', 1)
    costumer.changeAddress(newAddress)

    const costumerUpdatedEvent = new CostumerUpdatedEvent(newAddress)

    eventDispatcher.notify(costumerUpdatedEvent)

    expect(spyOnEventHandler).toHaveBeenCalled()
  })
})
