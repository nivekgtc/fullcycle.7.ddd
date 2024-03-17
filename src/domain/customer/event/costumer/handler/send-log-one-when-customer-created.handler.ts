import type EventHandlerInterface from '../../../../@shared/event/event-handler.interface'
import type EventInterface from '../../../../@shared/event/event.interface'
import CustomerCreatedEvent from '../customer-created.event'

export default class SendLogOneWhenCustomerCreatedHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: EventInterface): void {
    console.log(
      `This is the first console.log from event ${event.constructor.name}: `,
      event.eventData
    )
  }
}
