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
    const isCustomHandler = typeof targetProperty === 'function'
    const handler = (isCustomHandler && targetProperty) || (value => {
      target[targetProperty] = value
    })

    if (initialize) {
      handler(source[sourceProperty], target[targetProperty])
    }
    source.on(sourceProperty, handler)

    this.handlers.set(source, handler)
  }

  teardown () {
    this.handlers.forEach((handler, source) => {
      source.off(handler)
    })
    this.handlers.clear()
  }

  handlers = new Map()
}
