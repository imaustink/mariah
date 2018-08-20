import { Scope } from '../src/scope'

test('should create nested scope', () => {
  const scope = new Scope({foo: true}, {bar: false})

  expect(scope.get('foo')).toBe(true)
  expect(scope.get('bar')).toBe(false)
})

test('should set item in parent scope', () => {
  const parent = {}
  const scope = new Scope(parent, {})

  const returned = scope.set('foo', true)

  expect(returned).toBe(parent)
  expect(scope.get('foo')).toBe(true)
  expect(parent.foo).toBe(true)
})

test('should add child to existing scope', () => {
  const scope = new Scope({})

  scope.add({foo: true})

  expect(scope.get('foo')).toBe(true)
})
