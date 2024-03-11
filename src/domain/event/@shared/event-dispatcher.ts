import type EventDispatcherInterface from './event-dispatcher.interface'
import type EventHandlerInterface from './event-handler.interface'
import type EventInterface from './event.interface'

export default class EventDispatcher implements EventDispatcherInterface {
  private readonly eventHandlers: Record<string, EventHandlerInterface[]> = {}

  get getEventHandlers (): Record<string, EventHandlerInterface[]> {
    return this.eventHandlers
  }

  notify: (event: EventInterface) => void

  register (
    eventName: string,
    eventHandler: EventHandlerInterface<EventInterface>
  ): void {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = []
    }
    this.eventHandlers[eventName].push(eventHandler)
  }

  unregister: (
    eventName: string,
    eventHandler: EventHandlerInterface<EventInterface>
  ) => void

  unregisterAll: () => void
}
