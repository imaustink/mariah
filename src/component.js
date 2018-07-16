import { ObservableObject } from './observables'

export class Component extends HTMLElement {
  constructor () {
    super()
    if (this.template !== undefined) {
      throw new Error('Component should be extended with a template instance property or getter!')
    }
  }
  _vm = new ObservableObject()

  create ({ tag, viewModel, template }) {
    if (typeof tag !== 'string' || !tag.contains('-')) {
      throw new Error('A valid tag must be provided to create a new Component!')
    }
    if (typeof template !== 'string') {
      throw new Error('A valid template must be provided to create a new Component!')
    }
    class CustomComponent extends Component {
      _vm = new ObservableObject(viewModel)
    }
    customElements.define(tag, CustomComponent)

    return CustomComponent
  }
}
