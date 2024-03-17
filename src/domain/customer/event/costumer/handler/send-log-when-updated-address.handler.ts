import type EventHandlerInterface from '../../../../@shared/event/event-handler.interface'
import type EventInterface from '../../../../@shared/event/event.interface'
import CustomerUpdatedAddressEvent from '../customer-updated-address.event'

export default class SendLogWhenUpdatedAddressHandler
  implements EventHandlerInterface<CustomerUpdatedAddressEvent>
{
  handle(event: EventInterface): void {
    console.log(
      `Address of client: ${event.eventData.id}, ${event.eventData.name} updated to: `,
      event.eventData.address
    )
  }
}
