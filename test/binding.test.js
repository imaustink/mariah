import { ObservableObject } from '../src/observable'
import { Binding } from '../src/binding'

test('should setup two-way binding', () => {
  const child = new ObservableObject({ foo: false })
  const parent = new ObservableObject({ bar: true })
  const binding = new Binding(
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
  const binding = new Binding(
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
  const binding = new Binding(
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
