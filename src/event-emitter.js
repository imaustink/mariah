export class EventEmitter {
  on (name, handler) {
    if (!this.handlers[name]) {
      this.handlers[name] = new Map()
    }
    this.handlers[name].set(handler, handler)
  }

  off (name, handler) {
    const handlers = this.handlers[name]
    if (handlers) {
      handlers.delete(handler)
    }
  }

  emit (name, ...args) {
    const handlers = this.handlers[name]
    if (handlers) {
      handlers.forEach(handler => handler(...args))
    }
  }

  handlers = {}
}
