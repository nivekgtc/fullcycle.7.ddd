import type EventDispatcherInterface from './event-dispatcher.interface'
import type EventHandlerInterface from './event-handler.interface'
import type EventInterface from './event.interface'

export default class EventDispatcher implements EventDispatcherInterface {
  private readonly eventHandlers: Record<string, EventHandlerInterface[]> = {}

  get getEventHandlers (): Record<string, EventHandlerInterface[]> {
    return this.eventHandlers
  }

  notify (event: EventInterface): void {
    const { name: eventName } = event.constructor

    if (this.eventHandlers[eventName]) {
      this.eventHandlers[eventName].forEach(eventHandler => {
        eventHandler.handle(event)
      })
    }
  }

  register (
    eventName: string,
    eventHandler: EventHandlerInterface<EventInterface>
  ): void {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = []
    }
    this.eventHandlers[eventName].push(eventHandler)
  }

  unregister (
    eventName: string,
    eventHandler: EventHandlerInterface<EventInterface>
  ): void {
    if (this.eventHandlers[eventName]) {
      const index = this.eventHandlers[eventName].indexOf(eventHandler)

      if (index !== -1) {
        this.eventHandlers[eventName].splice(index, 1)
      }
    }
  }

  unregisterAll (): void {
    this.eventHandlers = {}
  }
}
