import type EventHandlerInterface from '../../../../@shared/event/event-handler.interface'
import type EventInterface from '../../../../@shared/event/event.interface'

export default class SendLogTwoWhenCostumerCreatedHandler
  implements EventHandlerInterface
{
  handle (event: EventInterface): void {
    console.log(
      `This is the second console.log from event ${event.constructor.name}: `,
      event.eventData
    )
  }
}
