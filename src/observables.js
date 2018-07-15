import { EventEmitter } from './event-emitter'

export class ObservableObject extends EventEmitter {
  // Using the object constructor because of an issue in @skatejs/ssr (skatejs/skatejs#1464)
  // eslint-disable-next-line no-new-object
  constructor (properties = new Object()) {
    super()
    const data = Object.assign(properties, {
      on: this.on,
      off: this.off,
      emit: this.emit
    })
    this._proxy = new Proxy(data, {
      set: (target, property, value) => {
        if (target[property] !== value) {
          const lastValue = target[property]

          target[property] = value

          target.emit('change', property, value, lastValue)
          target.emit(property, value, lastValue)
        }
        return true
      },
      get (target, property) {
        if (property === '_data') {
          return data
        }
        return target[property]
      }
    })

    return this._proxy
  }
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
