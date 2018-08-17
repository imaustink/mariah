import { ObservableObject } from '../src/observables'
import { PropertyBinding, ObjectBinding } from '../src/binding'

test('should setup two-way binding', () => {
  const child = new ObservableObject({ foo: false })
  const parent = new ObservableObject({ bar: true })
  const binding = new PropertyBinding(
    { child, property: 'foo' },
    { parent, property: 'bar' },
    { type: 'bind' }
  )

  expect(child.foo).toBe(true)

  child.foo = true
  parent.bar = true

  expect(parent.bar).toBe(true)
  expect(child.foo).toBe(true)

  binding.teardown()
})

test('should setup to child binding', () => {
  const child = new ObservableObject({ foo: true })
  const parent = new ObservableObject()
  const binding = new PropertyBinding(
    { child, property: 'foo' },
    { parent, property: 'bar' },
    { type: 'to' }
  )

  expect(parent.bar).toBe(true)

  child.foo = false

  expect(parent.bar).toBe(false)

  parent.foo = true

  expect(child.foo).toBe(false)

  binding.teardown()
})

test('should setup from child binding', () => {
  const child = new ObservableObject()
  const parent = new ObservableObject({ bar: true })
  const binding = new PropertyBinding(
    { child, property: 'foo' },
    { parent, property: 'bar' },
    { type: 'from' }
  )

  expect(child.foo).toBe(true)

  parent.bar = false

  expect(child.foo).toBe(false)

  child.foo = true

  expect(parent.bar).toBe(false)

  binding.teardown()
})

test('should emit changes from parent and child', () => {
  const child = new ObservableObject()
  const parent = new ObservableObject({ bar: true })
  const childChanges = [true, false]

  expect.assertions(6)

  child.on('change', (event, prop, val) => {
    expect(prop).toBe('foo')
    expect(val).toBe(childChanges.shift())
  })

  const binding = new PropertyBinding(
    { child, property: 'foo' },
    { parent, property: 'bar' },
    { type: 'bind' }
  )
  parent.on('change', (event, prop, val) => {
    expect(prop).toBe('bar')
    expect(val).toBe(false)
  })

  child.foo = false

  binding.teardown()
})

test('should two-way bind object', () => {
  const parent = new ObservableObject({ foo: true })
  const child = new ObservableObject()
  const binding = new ObjectBinding(child, parent, { type: 'bind' })

  expect(child.foo).toEqual(parent.foo)

  parent.foo = false
  parent.bar = 'hello'

  expect(child.foo).toBe(parent.foo)
  expect(child.bar).toBe(parent.bar)

  child.baz = 'thing'

  expect(child.baz).toBe(parent.baz)

  binding.teardown()
})

test('should bind child to parent', () => {
  const parent = new ObservableObject()
  const child = new ObservableObject({ foo: true })
  const binding = new ObjectBinding(child, parent, { type: 'to' })

  expect(child.foo).toEqual(parent.foo)

  parent.foo = false
  parent.bar = 'hello'

  expect(child.foo).toBe(true)
  expect(child.bar).toBe(undefined)

  child.baz = 'thing'

  expect(child.baz).toBe(parent.baz)

  binding.teardown()
})

test('should bind parent to child', () => {
  const parent = new ObservableObject({ foo: true })
  const child = new ObservableObject()
  const binding = new ObjectBinding(child, parent, { type: 'from' })

  expect(child.foo).toEqual(parent.foo)

  child.foo = false
  child.bar = 'hello'

  expect(parent.foo).toBe(true)
  expect(parent.bar).toBe(undefined)

  parent.baz = 'thing'

  expect(parent.baz).toBe(parent.baz)

  binding.teardown()
})
