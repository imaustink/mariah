import { EventEmitter } from './event-emitter'
import { isObservableSymbol } from './symbols'

export class BaseObservable {
  constructor (initial) {
    if (initial[isObservableSymbol]) {
      return initial
    }
    const isArray = Array.isArray(initial)
    const emitter = new EventEmitter()
    this._data = Object.assign(initial, {
      on: emitter.on.bind(emitter),
      off: emitter.off.bind(emitter),
      emit: emitter.emit.bind(emitter)
    })
    this._proxy = new Proxy(this._data, {
      set (target, property, value) {
        const lastValue = target[property]
        let success = true

        if (lastValue !== value) {
          value = hydrate(...arguments)

          Reflect.set(target, property, value)

          if (!isArray || property !== 'length') {
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

export class ObservableObject extends BaseObservable {
  // Using the Object constructor because of github.com/skatejs/skatejs/issues/1464
  // eslint-disable-next-line no-new-object
  constructor (initial = new Object()) {
    // eslint-disable-next-line constructor-super
    return super(initial)
  }
}

export class ObservableArray extends BaseObservable {
  // Using the Array constructor because of github.com/skatejs/skatejs/issues/1464
  // eslint-disable-next-line no-array-constructor
  constructor (initial = new Array()) {
    // eslint-disable-next-line constructor-super
    return super(initial)
  }
}

export function getAndHydrate (target, property) {
  if (property in target) {
    let value = Reflect.get(...arguments)
    value = hydrate(target, property, value)
    Reflect.set(target, property, value)
    return value
  }
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
