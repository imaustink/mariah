import { Component } from '../src/component'
import { ObservableObject } from '../src/observables'

test('Should use Component.create to creates and registers a component', () => {
  const MyComponent = Component.create({
    tag: 'my-component',
    template: '<p>Hello World</p>',
    viewModel: {
      foo: true
    }
  })
  const component = new MyComponent()

  expect(component).toBeInstanceOf(Component)
  expect(component.viewModel.foo).toBe(true)
})

test('Should render component', () => {
  class MyComponent extends Component {
    viewModel = new ObservableObject({
      shown: true,
      message: 'Hello World!'
    })
    template = '<p m-if="shown">{{message}}</p>'
  }

  const component = new MyComponent()
  document.body.appendChild(component)

  expect(document.body.firstChild.firstChild.tagName).toBe('P')
  expect(document.body.firstChild.firstChild.textContent).toBe('Hello World!')
})
