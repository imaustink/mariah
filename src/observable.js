import { EventEmitter } from './event-emitter'

export class ObservableObject extends EventEmitter {
  constructor (properties = {}) {
    super()
    this._data = Object.assign(properties, {
      on: this.on.bind(this),
      off: this.off.bind(this),
      emit: this.emit.bind(this),
      _ignoreObservation: callback => {
        this._ignore = true
        callback()
        this._ignore = false
      }
    })
    this._proxy = new Proxy(this._data, {
      set: (target, property, value) => {
        const lastValue = target[property]

        target[property] = value

        if (!this._ignore) {
          target.emit('change', property, value, lastValue)
          target.emit(property, value, lastValue)
        }

        return true
      }
    })

    return this._proxy
  }
  _ignore = false
}

export class ObservableArray extends EventEmitter {
  constructor (initial = []) {
    super()
    this._data = Object.assign(initial, {
      on: this.on.bind(this),
      off: this.off.bind(this),
      emit: this.emit.bind(this)
    })
    this._proxy = new Proxy(this._data, {
      set (target, property, value) {
        const lastValue = target[property]

        target[property] = value

        if (property !== 'length') {
          target.emit('change', property, value, lastValue)
          target.emit(property, value, lastValue)
        }

        return true
      },
      get (target, property) {
        return target[property]
      }
    })
    return this._proxy
  }
}
