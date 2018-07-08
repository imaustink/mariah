import { ObservableObject, ObservableArray } from '../src/observable'

test('should be instance of Object', () => {
  const m = new ObservableObject()

  expect(m).toBeInstanceOf(Object)
})

test('should emit all map changes to handler', () => {
  const m = new ObservableObject()

  expect.assertions(5)

  m.on('change', (prop, val, last) => {
    if (prop === 'foo') {
      expect(last).toBe(undefined)
      expect(val).toBe(true)
    }
    if (prop === 'bar') {
      if (last === undefined) {
        expect(val).toBe(false)
      } else {
        expect(val).toBe(true)
        expect(last).toBe(false)
      }
    }
  })

  m.foo = true
  m.bar = false
  m.bar = true
})

test('should emit map property changes to handler', () => {
  const m = new ObservableObject()

  expect.assertions(3)

  m.on('foo', (val, last) => {
    if (last === undefined) {
      expect(val).toBe(true)
    } else {
      expect(val).toBe(false)
      expect(last).toBe(true)
    }
  })

  m.foo = true
  m.foo = false
})

test('should emit all list changes to hander', () => {
  const l = new ObservableArray()
  const items = {
    0: 'first',
    1: 'second'
  }

  expect.assertions(4)

  l.on('change', (i, val, last) => {
    expect(val).toBe(items[i])
    expect(last).toBe(undefined)
  })

  l.push(items[0])
  l.push(items[1])
})

test('should emit list property changes to handler', () => {
  const l = new ObservableArray()

  expect.assertions(3)

  l.on('foo', (val, last) => {
    if (last === undefined) {
      expect(val).toBe(true)
    } else {
      expect(val).toBe(false)
      expect(last).toBe(true)
    }
  })

  l.foo = true
  l.foo = false
})
