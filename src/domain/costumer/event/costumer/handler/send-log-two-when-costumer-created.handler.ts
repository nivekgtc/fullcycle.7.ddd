import type EventHandlerInterface from '../../../../@shared/event/event-handler.interface'
import type EventInterface from '../../../../@shared/event/event.interface'
import CostumerCreatedEvent from '../costumer-created.event'

export default class SendLogTwoWhenCostumerCreatedHandler
  implements EventHandlerInterface<CostumerCreatedEvent>
{
  handle (event: EventInterface): void {
    console.log(
      `This is the second console.log from event ${event.constructor.name}: `,
      event.eventData
    )
  }
}
