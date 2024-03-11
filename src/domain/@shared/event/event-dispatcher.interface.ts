import type EventHandlerInterface from './event-handler.interface'
import type EventInterface from './event.interface'

export default interface EventDispatcherInterface {
  notify: (event: EventInterface) => void
  register: (eventName: string, eventHandler: EventHandlerInterface) => void
  unregister: (eventName: string, eventHandler: EventHandlerInterface) => void
  unregisterAll: () => void
}
