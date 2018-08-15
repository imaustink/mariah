import {
  renderFragmentFromHTML,
  createElementFromAST,
  createLiveTextFragment,
  teardownBindings,
  removeNode,
  nodeBindings
} from '../src/renderer'
// These DOM helpers are needed because SkateJS doesn't implement them.
import { getElementsByTagName } from './helpers'
import { Component } from '../src/component'
import { ObservableObject, ObservableArray } from '../src/observables'
import { Binding } from '../src/binding'

test('should create live text nodes in document fragment', () => {
  const scope = new ObservableObject({ bar: 'hello', qux: 'world' })
  const frag = createLiveTextFragment('foo {{bar}} baz {{qux}}', scope)

  expect(frag.textContent).toBe('foo hello baz world')

  scope.bar = 'bar'
  scope.qux = 'qux'

  expect(frag.textContent).toBe('foo bar baz qux')

  scope.bar = 'one'
  scope.qux = 'two'

  expect(frag.textContent).toBe('foo one baz two')

  teardownBindings(frag)
})

test('should create simple text node', () => {
  const frag = createLiveTextFragment('hello world')

  expect(frag.textContent).toBe('hello world')
})

test('should create native element', () => {
  const p = createElementFromAST({
    tagName: 'p',
    children: [],
    attributes: []
  })

  expect(p).toBeInstanceOf(HTMLElement)
  expect(p.tagName).toBe('P')
})

test('should create custom element', () => {
  class TestComponent extends Component {
    template = ''
  }

  customElements.define('test-component', TestComponent)

  const ce = createElementFromAST({
    tagName: 'test-component',
    children: [],
    attributes: []
  })

  expect(ce).toBeInstanceOf(TestComponent)
})

test('should teardown text node binding on removal', () => {
  const scope = new ObservableObject({ foo: 'bar' })
  const node = createLiveTextFragment('{{foo}}', scope).firstChild
  const binding = nodeBindings.get(node)

  expect(binding[0]).toBeInstanceOf(Binding)

  removeNode(node)

  expect(nodeBindings.get(node)).toBe(undefined)
  expect(nodeBindings.size).toBe(0)
  expect(binding[0].handlers.size).toBe(0)
})

test('should teardown child text node bindings on removal', () => {
  const scope = new ObservableObject({ foo: 'bar', baz: 'qux' })
  const node = createLiveTextFragment('{{foo}} {{baz}}', scope)

  removeNode(node)

  expect(nodeBindings.size).toBe(0)
})

test('should teardown deeply nested bindings', () => {
  const scope = new ObservableObject({ foo: 'bar', baz: 'qux' })
  const p = createElementFromAST({
    tagName: 'p',
    children: [],
    attributes: []
  })
  const subP = createElementFromAST({
    tagName: 'p',
    children: [],
    attributes: []
  })

  p.appendChild(createLiveTextFragment('{{foo}}', scope))
  p.appendChild(subP)
  subP.appendChild(createLiveTextFragment('{{baz}}', scope))

  expect(nodeBindings.size).toBe(2)

  teardownBindings(p)

  expect(nodeBindings.size).toBe(0)
})

test('should create a single text nodes', () => {
  const scope = new ObservableObject({ foo: 'bar' })
  const node = createLiveTextFragment('{{foo}}', scope)

  expect(node.childNodes.length).toBe(1)
  expect(node.firstChild.nodeValue).toBe('bar')

  teardownBindings(node)
})

test('should render simple fragment from HTML', () => {
  const frag = renderFragmentFromHTML(`<div><p>Hello World</p></div>`)

  expect(frag.firstChild.tagName).toBe('DIV')
  expect(frag.firstChild.firstChild.tagName).toBe('P')
  expect(frag.firstChild.firstChild.firstChild.nodeValue).toBe('Hello World')
})

test('should render live fragment from HTML', () => {
  const scope = new ObservableObject({ greeting: 'Hello World' })
  const frag = renderFragmentFromHTML(`<div><p>{{greeting}}</p></div>`, scope)

  expect(frag.firstChild.tagName).toBe('DIV')
  expect(frag.firstChild.firstChild.tagName).toBe('P')
  expect(frag.firstChild.firstChild.firstChild.nodeValue).toBe('Hello World')

  scope.greeting = 'Hello Everyone'

  expect(frag.firstChild.firstChild.firstChild.nodeValue).toBe('Hello Everyone')

  teardownBindings(frag)
})

test('should create element with live attribute', () => {
  const scope = new ObservableObject({ id: 'foo', otherThing: 'bar' })
  const div = renderFragmentFromHTML('<div id="{{id}}-{{otherThing}}"></div>', scope)
    .firstChild

  expect(div.getAttribute('id')).toBe('foo-bar')

  scope.id = 'bar'
  scope.otherThing = 'baz'

  expect(div.getAttribute('id')).toBe('bar-baz')

  scope.id = 'hello'
  scope.otherThing = 'world'

  expect(div.getAttribute('id')).toBe('hello-world')

  teardownBindings(div)
})

test('should bind event to handler in scope', () => {
  expect.assertions(2)
  const scope = new ObservableObject({
    handler (event) {
      expect(event).toBeInstanceOf(Event)
    }
  })
  const button = renderFragmentFromHTML('<button m-on:click="handler"></button>', scope)
    .firstChild

  button.dispatchEvent(new Event('click'))

  teardownBindings(button)

  expect(nodeBindings.size).toBe(0)
})

test('should conditionally render child', () => {
  const scope = new ObservableObject({ shown: true })
  const frag = renderFragmentFromHTML('<div m-if="shown">Hello World!</div>', scope)

  expect(frag.firstChild.nodeType).toBe(Node.ELEMENT_NODE)
  expect(frag.firstChild.textContent).toBe('Hello World!')

  scope.shown = false

  expect(frag.firstChild.nodeType).toBe(Node.TEXT_NODE)
  expect(frag.firstChild.textContent).toBe('')

  scope.shown = true

  expect(frag.firstChild.nodeType).toBe(Node.ELEMENT_NODE)
  expect(frag.firstChild.textContent).toBe('Hello World!')

  teardownBindings(frag)
})

test('should render live list from Array of Objects', () => {
  const scope = new ObservableObject({
    items: [
      {
        name: 'foo'
      },
      {
        name: 'bar'
      },
      {
        name: 'baz'
      }
    ]
  })
  const frag = renderFragmentFromHTML(
    '<ul><li m-for="items" id="item-{{$index}}">{{name}}</li></il>',
    scope
  )

  getElementsByTagName(frag, 'li').forEach((li, i) => {
    expect(li.textContent).toBe(scope.items[i].name)
    // expect(li.getAttribute('id')).toBe(`item-${i}`)
  })
})
