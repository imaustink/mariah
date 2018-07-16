import { ObservableObject, ObservableArray } from '../src/observables'

test('should be instance of Object', () => {
  const m = new ObservableObject()

  expect(m).toBeInstanceOf(Object)
})

test('should emit all map changes to handler when set', () => {
  const m = new ObservableObject()

  expect.assertions(8)

  m.on('change', (event, prop, val, last) => {
    expect(event.type).toBe('set')
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

test('should emit map property changes to handler when set', () => {
  const m = new ObservableObject()

  expect.assertions(5)

  m.on('foo', (event, val, last) => {
    expect(event.type).toBe('set')
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

test('should emit all map changes when property is deleted', () => {
  const m = new ObservableObject()
  const results = [{prop: 'foo', last: true}, {prop: 'bar', last: false}]

  expect.assertions(6)

  m.on('change', (event, prop, val, last) => {
    if (event.type === 'delete') {
      const result = results.shift()
      expect(prop).toBe(result.prop)
      expect(val).toBe(undefined)
      expect(last).toBe(result.last)
    }
  })

  m.foo = true
  m.bar = false

  delete m.foo
  delete m.bar
})

test('should be instance of Array', () => {
  const l = new ObservableArray()

  expect(l).toBeInstanceOf(Array)
})

test('should emit all list changes to hander when set', () => {
  const l = new ObservableArray()
  const results = { 0: 'first', 1: 'second', foo: true }

  expect.assertions(9)

  l.on('change', (event, i, val, last) => {
    expect(event.type).toBe('set')
    expect(val).toBe(results[i])
    expect(last).toBe(undefined)
  })

  l.push(results[0])
  l.push(results[1])
  l.foo = true
})

test('should emit list property changes to handler when set', () => {
  const l = new ObservableArray()

  expect.assertions(5)

  l.on('foo', (event, val, last) => {
    expect(event.type).toBe('set')
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

test('should emit list property changes to handler when deleted', () => {
  const l = new ObservableArray()
  const results = [
    {prop: '1', last: 'world'},
    {prop: '0', last: 'hello'},
    {prop: 'foo', last: true}
  ]

  expect.assertions(9)

  l.on('change', (event, prop, val, last) => {
    if (event.type === 'delete') {
      const result = results.shift()
      expect(prop).toBe(result.prop)
      expect(val).toBe(undefined)
      expect(last).toBe(result.last)
    }
  })

  l.push('hello')
  l.push('world')
  l.foo = true

  l.splice(1, 1)
  l.splice(0, 1)
  delete l.foo
})
