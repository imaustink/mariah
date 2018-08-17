export const nodeBindings = new Map()

export function addEventListener (element, name, handler) {
  element.addEventListener(name, handler)

  registerBinding(element, {
    teardown () {
      element.removeEventListener(name, handler)
    }
  })
}

export function registerBinding (node, binding) {
  const bindings = nodeBindings.get(node)

  if (bindings) {
    bindings.push(binding)
  } else {
    nodeBindings.set(node, [binding])
  }
}

export class BaseBinding {
  registerHandler (source, handler) {
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

export class PropertyBinding extends BaseBinding {
  constructor (cc, pc, { type }) {
    super()
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
    const handler = (isCustomHandler && targetProperty) || ((event, value) => {
      target[targetProperty] = value
    })

    if (initialize) {
      handler(null, source[sourceProperty], target[targetProperty])
    }
    source.on(sourceProperty, handler)

    this.registerHandler(source, handler)
  }
}

export class ObjectBinding extends BaseBinding {
  constructor (child, parent, { type = 'bind' }) {
    super()
    switch (type) {
      case 'bind':
        this.bind(parent, child, true)
        this.bind(child, parent)
        break
      case 'to':
        this.bind(child, parent, true)
        break
      case 'from':
        this.bind(parent, child, true)
        break
    }
  }
  bind (from, to, initialize) {
    if (initialize) {
      Object.assign(to, from)
    }
    const handler = (event, property, value) => {
      switch (event.type) {
        case 'set':
          to[property] = value
          break
        case 'delete':
          delete to[property]
          break
      }
    }
    from.on('change', handler)

    this.registerHandler(from, handler)
  }
}
