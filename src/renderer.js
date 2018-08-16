import { parse } from 'himalaya'
import { Binding } from './binding'

export const MAGIC_TAGS_REGEXP = /{{\s*([^}]+)\s*}}/

export const DIRECTIVE_PREFIX = 'm-'

export const directives = {
  bind (targetElement, childProp, scopeKey, scope) {
    function updateViewModel () {
      scope[scopeKey] = targetElement.value
    }
    function updateElement (event, value) {
      targetElement.value = value
    }
    if (targetElement.viewModel) {
      // TODO: setup bindings from scope to the custom element's VM here
    } else {
      // TODO: implement select, check
      addEventListener(targetElement, 'input', updateViewModel)
      if (targetElement.value) {
        updateViewModel()
      }

      const binding = new Binding({
        child: {},
        property: updateElement
      },
      {
        parent: scope,
        property: scopeKey
      },
      {
        type: 'from'
      })

      registerBinding(targetElement, binding)
    }
  },
  on (targetElement, eventName, scopeKey, scope) {
    const value = scope[scopeKey]
    addEventListener(targetElement, eventName, function (event) {
      if (typeof value === 'function') {
        value.call(scope, event)
      }
    })
  },
  if (targetElement, _, scopeKey, scope) {
    const placeholder = document.createTextNode('')
    const frag = document.createDocumentFragment()

    frag.appendChild(placeholder)

    function update (event, value) {
      if (value) {
        placeholder.parentNode.replaceChild(targetElement, placeholder)
      } else {
        targetElement.parentNode.replaceChild(placeholder, targetElement)
      }
    }
    const binding = new Binding({
      child: {},
      property: update
    },
    {
      parent: scope,
      property: scopeKey
    },
    {
      type: 'from'
    })

    registerBinding(targetElement, binding)

    return frag
  },
  for (nodeInfo, scopeKey, scope) {
    const elementMap = new Map()
    const indexMap = {}
    const value = scope[scopeKey]
    const frag = document.createDocumentFragment()
    const placeholder = document.createTextNode('')

    frag.appendChild(placeholder)

    function getParent () {
      return placeholder.parentNode
    }

    function add (value, index) {
      const element = renderFragmentFromAST([nodeInfo], value).firstChild

      if (indexMap[index]) {
        const currentElement = indexMap[index]
        elementMap.delete(currentElement)
        elementMap.set(element, index)
        indexMap[index] = element
        getParent().replaceChild(element, currentElement)
        teardownBindings(currentElement)
      } else {
        elementMap.set(element, index)
        indexMap[index] = element
        // TODO this needs to be fixed for objects to work
        getParent().appendChild(element)
      }
    }

    function remove (index) {
      const element = indexMap[index]
      if (element) {
        removeNode(element)
        // TODO this needs to be fixed for objects to work
        while (indexMap[index]) {
          const nextElement = indexMap[index + 1]
          indexMap[index] = nextElement
          if (nextElement) {
            elementMap.set(nextElement, index)
          }
          index++
        }
      }
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        add(value[i], i)
      }
    } else if (typeof value === 'object') {
      for (let key in value) {
        if (value.hasOwnProperty(key)) {
          add(value[key], key)
        }
      }
    }

    value.on('change', (event, property, value) => {
      if (event.type === 'set') {
        add(value, property)
      } else if (event.type === 'delete') {
        remove(property)
      }
    })

    return frag

    // TODO: Register binding to parent
    // Need to improve Binding before this is possible
  }
}

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

// Recursively traverse the a DOM tree and teardown all bindings
export function teardownBindings (node) {
  const bindings = nodeBindings.get(node)
  const childNodes = node.childNodes
  if (bindings) {
    for (let i = 0; i < bindings.length; i++) {
      bindings[i].teardown()
    }
    nodeBindings.delete(node)
  }
  if (childNodes && childNodes.length) {
    for (let i = 0; i < childNodes.length; i++) {
      teardownBindings(childNodes[i])
    }
  }
}

export function render (template, scope) {
  // TODO: should support <template> tags
  if (typeof template === 'string') {
    return renderFragmentFromHTMLString(template, scope)
  }
  if (template instanceof HTMLElement && template.tagName === 'SCRIPT') {
    return renderFragmentFromHTMLString(template.textContent, scope)
  }
}

// Parse a template into an AST and render it
export function renderFragmentFromHTMLString (template, scope) {
  const ast = parse(template)

  return renderFragmentFromAST(ast, scope)
}

// Render from a DOM AST
export function renderFragmentFromAST (ast, scope, parent = document.createDocumentFragment()) {
  for (let i = 0; i < ast.length; i++) {
    const nodeInfo = ast[i]

    switch (nodeInfo.type) {
      case 'element':
        let element = createLiveElement(nodeInfo, scope)

        parent.appendChild(element)

        if (nodeInfo.children.length) {
          element.appendChild(renderFragmentFromAST(nodeInfo.children, scope))
        }
        break
      case 'text':
        const node = createLiveTextFragment(nodeInfo.content, scope)
        parent.appendChild(node)
        break
    }
  }

  return parent
}

// Remove a node and cleanup any bindings on it
export function removeNode (node) {
  teardownBindings(node)
  node.remove()
}

// Breaks up a string where variables are found and replace them with live bound text nodes
export function createLiveTextFragment (content, scope) {
  const fragment = document.createDocumentFragment()

  enumerateMustacheValues(content, (startingIndex, outerWidth, name) => {
    const value = scope[name]
    const prefix = content.slice(0, startingIndex)
    const liveNode = document.createTextNode(value)
    content = content.slice(startingIndex + outerWidth)

    if (prefix.length > 1) {
      fragment.appendChild(document.createTextNode(prefix))
    }
    fragment.appendChild(liveNode)

    const binding = new Binding({
      child: liveNode,
      property: 'nodeValue'
    },
    {
      parent: scope,
      property: name
    },
    {
      type: 'from'
    })

    registerBinding(liveNode, binding)

    return content
  })

  if (content) {
    fragment.appendChild(document.createTextNode(content))
  }

  return fragment
}

export function createLiveElement (nodeInfo, scope) {
  const { tagName, attributes } = nodeInfo
  // TODO: this is slow, building my own parser would mean I could avoid things like this
  const forDirectiveIndex = attributes
    .findIndex(attribute => attribute.key === `${DIRECTIVE_PREFIX}for`)

  if (forDirectiveIndex !== -1) {
    const scopeKey = attributes[forDirectiveIndex].value
    attributes.splice(forDirectiveIndex, 1)
    return directives.for(nodeInfo, scopeKey, scope)
  }

  // TODO: Should pass nodeInfo to all directives
  const element = document.createElement(tagName)

  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i]
    if (attribute.key.startsWith(DIRECTIVE_PREFIX)) {
      const keyParts = attribute.key.slice(2).split(':')
      const directiveName = keyParts[0]
      const directiveValue = keyParts[1]
      const directive = directives[directiveName]
      if (typeof directive === 'function') {
        directive(element, directiveValue, attribute.value, scope)
      }
    } else if (attribute.value) {
      const attributeValue = attribute.value
      const {
        content,
        map
      } = interpolateMustacheValues(attributeValue, scope)
      const binding = new Binding({
        child: {},
        property (event, property) {
          if (map[property]) {
            const {
              content
            } = interpolateMustacheValues(attributeValue, scope)
            element.setAttribute(attribute.key, content)
          }
        }
      },
      {
        parent: scope,
        property: 'change'
      },
      {
        type: 'from'
      })

      registerBinding(element, binding)
      element.setAttribute(attribute.key, content)
    }
  }

  return element
}

export function enumerateMustacheValues (content, callback) {
  const map = {}
  let currentVariable

  // eslint-disable-next-line no-cond-assign
  while (currentVariable = MAGIC_TAGS_REGEXP.exec(content, 'gm')) {
    if (currentVariable) {
      const staringIndex = currentVariable.index
      const outerWidth = currentVariable[0].length
      const name = currentVariable[1]

      content = callback(staringIndex, outerWidth, name)
      map[name] = true
    }
  }

  return map
}

export function interpolateMustacheValues (content, data) {
  const map = enumerateMustacheValues(content,
    (startingIndex, outerWidth, name) => {
      content = spliceString(content, startingIndex, outerWidth, data[name])
      return content
    }
  )
  return { content, map }
}

export function spliceString (string, start, length, value) {
  return `${string.slice(0, start)}${value}${string.slice(start + length)}`
}
