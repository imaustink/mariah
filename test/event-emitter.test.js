import { EventEmitter } from '../src/event-emitter'

test('should emit event to handler', () => {
  const e = new EventEmitter()

  e.on('foo', (arg0, arg1, arg2) => {
    expect(arg0).toBe(0)
    expect(arg1).toBe(1)
    expect(arg2).toBe(2)
  })

  e.emit('foo', 0, 1, 2)
})

test('should unbind handler', () => {
  const e = new EventEmitter()
  const handler = () => {
    throw new Error('should be unbound')
  }

  e.on('foo', handler)
  e.on('foo', (ev) => expect(ev).toEqual({}))
  e.off('foo', handler)

  e.emit('foo', {})
})
