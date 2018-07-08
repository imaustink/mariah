export class Binding {
  constructor (cc, pc, { type }) {
    switch (type) {
      case 'bind':
        this.bind(pc.parent, pc.property, cc.child, cc.property, true)
        this.bind(cc.child, cc.property, pc.parent, pc.property)
        break
      case 'to':
        this.bind(cc.child, cc.property, pc.parent, pc.property, true)
        break
      case 'from':
        this.bind(pc.parent, pc.property, cc.child, cc.property, true)
        break
    }
  }

  bind (source, sourceProperty, target, targetProperty, initialize) {
    const handler = (value) => {
      target._ignoreObservation(() => {
        target[targetProperty] = value
      })
    }

    if (initialize) {
      target[targetProperty] = source[sourceProperty]
    }
    source.on(sourceProperty, handler)

    this.bindings.set(source, handler)
  }

  teardown () {
    this.bindings.forEach((handler, source) => {
      source.off(handler)
      this.bindings.delete(handler)
    })
  }

  bindings = new Map()
}
