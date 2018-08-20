import { ObservableObject } from '../src/observables'
import { directives } from '../src/directives'

test('should dynamically set classes with m-class', () => {
  const div = document.createElement('div')
  const scope = new ObservableObject({ bar: true, qux: false })

  directives.class(div, undefined, 'foo: bar, baz: qux', scope)

  expect(div.classList.contains('foo')).toBe(true)
  expect(div.classList.contains('baz')).toBe(false)

  scope.bar = false
  scope.qux = true

  expect(div.classList.contains('foo')).toBe(false)
  expect(div.classList.contains('baz')).toBe(true)
})

test('should dynamically set attributes with m-attr', () => {
  const div = document.createElement('div')
  const scope = new ObservableObject({ isDisabled: false })

  directives.attr(div, 'disabled', 'isDisabled', scope)

  expect(div.hasAttribute('disabled')).toBe(false)

  scope.isDisabled = true

  expect(div.hasAttribute('disabled')).toBe(true)

  scope.isDisabled = 'foo'

  expect(div.getAttribute('disabled')).toBe('foo')
})
