import type EventHandlerInterface from '../../../../@shared/event/event-handler.interface'
import type EventInterface from '../../../../@shared/event/event.interface'

export default class SendLogWhenUpdatedAddressHandler
  implements EventHandlerInterface
{
  handle (event: EventInterface): void {
    console.log(
      `Address of client: ${event.eventData.id}, ${event.eventData.name} updated to: `,
      event.eventData.address
    )
  }
}
