import type EventHandlerInterface from '../../@shared/event-handler.interface'
import type EventInterface from '../../@shared/event.interface'

export default class SendLogOneWhenCostumerCreatedHandler
  implements EventHandlerInterface
{
  handle (event: EventInterface): void {
    console.log(
      `This is the first console.log from event ${event.constructor.name}: `,
      event.eventData
    )
  }
}
