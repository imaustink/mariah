import { ObservableObject } from './observables'

export class Component extends HTMLElement {
  constructor () {
    super()
    if (this.template !== undefined) {
      throw new Error('Component should be extended with a template instance property or getter!')
    }
  }
  _vm = new ObservableObject()
}
