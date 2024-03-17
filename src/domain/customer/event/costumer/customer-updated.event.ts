import type EventInterface from '../../../@shared/event/event.interface'

export default class CustomerUpdatedEvent implements EventInterface {
  dataTimeOcurred: Date
  eventData: any

  constructor(eventData: any) {
    this.dataTimeOcurred = new Date()
    this.eventData = eventData
  }
}
