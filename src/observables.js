import { EventEmitter } from './event-emitter'
import { isObservableSymbol } from './symbols'

// TODO: use revocable proxies
// TODO: don't hydrate observables

export class ObservableObject extends EventEmitter {
  // Using the Object constructor because of an issue in @skatejs/ssr (skatejs/skatejs#1464)
  // eslint-disable-next-line no-new-object
  constructor (properties = new Object()) {
    super()
    this._data = Object.assign(properties, {
      on: this.on,
      off: this.off,
      emit: this.emit
    })
    this._proxy = new Proxy(this._data, {
      set (target, property, value) {
        const lastValue = target[property]
        let success = true

        if (lastValue !== value) {
          value = hydrate(...arguments)

          Reflect.set(target, property, value)

          target.emit('change', { type: 'set' }, property, value, lastValue)
          target.emit(property, { type: 'set' }, value, lastValue)
        }

        return success
      },
      get (target, property) {
        if (property === '_data') {
          return this._data
        }

        return getAndHydrate(...arguments)
      },
      deleteProperty (target, property) {
        const lastValue = target[property]

        target.emit('change', { type: 'delete' }, property, undefined, lastValue)
        target.emit(property, { type: 'delete' }, undefined, lastValue)

        return Reflect.deleteProperty(...arguments)
      }
    })

    return this._proxy
  }
}

export class ObservableArray extends EventEmitter {
  // Using the Array constructor because of an issue in @skatejs/ssr (skatejs/skatejs#1464)
  // eslint-disable-next-line no-array-constructor
  constructor (initial = new Array()) {
    super()
    this._data = Object.assign(initial, {
      on: this.on.bind(this),
      off: this.off.bind(this),
      emit: this.emit.bind(this)
    })
    this._proxy = new Proxy(this._data, {
      set (target, property, value) {
        const lastValue = target[property]
        let success = true
        if (lastValue !== value) {
          value = hydrate(...arguments)

          Reflect.set(target, property, value)

          if (property !== 'length') {
            target.emit('change', { type: 'set' }, property, value, lastValue)
            target.emit(property, { type: 'set' }, value, lastValue)
          }
        }

        return success
      },
      get (target, property) {
        if (property === '_data') {
          return this._data
        }

        return getAndHydrate(...arguments)
      },
      deleteProperty (target, property) {
        const lastValue = target[property]

        target.emit('change', { type: 'delete' }, property, undefined, lastValue)
        target.emit(property, { type: 'delete' }, undefined, lastValue)

        return Reflect.deleteProperty(...arguments)
      }
    })
    return this._proxy
  }
}

export function getAndHydrate (target, property) {
  let value = Reflect.get(...arguments)
  value = hydrate(target, property, value)
  Reflect.set(target, property, value)
  return value
}

export function hydrate (target, property, value) {
  if (typeof value === 'object' && !value[isObservableSymbol]) {
    if (Array.isArray(value)) {
      value = new ObservableArray(value)
    } else {
      value = new ObservableObject(value)
    }
    value[isObservableSymbol] = true
  }
  return value
}
