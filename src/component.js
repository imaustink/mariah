import { ObservableObject } from './observables'
import { render, removeNode } from './renderer'
import './custom-element-shim'

export class Component extends HTMLElement {
  constructor () {
    super()
    if (this.template !== undefined) {
      throw new Error('Component should be extended with a template instance property or getter!')
    }
  }
  viewModel = new ObservableObject()

  // TODO: consider a decorator for this
  static create ({ tag, template, viewModel }) {
    if (typeof tag !== 'string' || !tag.includes('-')) {
      throw new Error('A valid tag must be provided to create a new Component!')
    }
    class CustomComponent extends Component {
      viewModel = new ObservableObject(viewModel)
      template = template
    }
    customElements.define(tag, CustomComponent)

    return CustomComponent
  }

  childrenConnectedCallback () {}

  connectedCallback () {
    const connectedCallback = this.viewModel.connectedCallback
    if (typeof connectedCallback === 'function') {
      connectedCallback.apply(this, arguments)
    }
    this.appendChild(render(this.template, this.viewModel))
    this.childrenConnectedCallback()
  }

  disconnectedCallback () {
    const disconnectedCallback = this.viewModel.disconnectedCallback
    if (typeof disconnectedCallback === 'function') {
      disconnectedCallback.apply(this, arguments)
    }
    removeNode(this)
  }
}
