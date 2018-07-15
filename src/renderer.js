import { parse } from 'himalaya'
import { Component } from './component'
import { Binding } from './binding'

export const MAGIC_TAGS_REGEXP = /{{\s*([^}]+)\s*}}/

export const DIRECTIVE_PREFIX = 'm-'

export const directives = {
  bind (element, key, value, scope) {
    if (element._vm) {

    } else {

    }
  },
  on (element, name, key, scope) {
    const value = scope[key]
    addEventListener(element, name, function (event) {
      if (typeof value === 'function') {
        value(event)
      }
    })
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

// Parse a template into an AST and render it
export function renderFragmentFromHTML (template, viewModel) {
  const ast = parse(template)

  return renderFragmentFromAST(ast, viewModel)
}

// Render from a DOM AST
export function renderFragmentFromAST (ast, scope) {
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < ast.length; i++) {
    const nodeInfo = ast[i]
    let node

    switch (nodeInfo.type) {
      case 'element':
        node = createLiveElement(nodeInfo.tagName, nodeInfo.attributes, scope)
        if (nodeInfo.children.length) {
          node.appendChild(renderFragmentFromAST(nodeInfo.children, scope))
        }
        break
      case 'text':
        node = createLiveTextFragment(nodeInfo.content, scope)
        break
    }

    fragment.appendChild(node)
  }

  return fragment
}

// Remove a node and cleanup any bindings on it
export function removeNode (node) {
  teardownBindings(node)
  node.remove()
}

// Create an element and setup binding to a scope
export function createLiveElement (tagName, attributes, scope) {
  const node = document.createElement(tagName)

  if (node instanceof Component) {
    // TODO setup bindings from scope to the custom element's VM here
    node.appendChild(renderFragmentFromHTML(node.template, node._vm))
  }

  if (attributes && attributes.length) {
    bindPropertyOrAttribute(node, attributes, scope)
  }

  return node
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

export function bindPropertyOrAttribute (element, attributes, scope) {
  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i]
    if (attribute.key.startsWith(DIRECTIVE_PREFIX)) {
      const keyParts = attribute.key.slice(2).split(':')
      const directive = directives[keyParts[0]]
      if (typeof directive === 'function') {
        directive(element, keyParts[1], attribute.value, scope)
      }
    } else if (attribute.value) {
      const attributeValue = attribute.value
      const { content, map } = interpolateMustacheValues(attributeValue, scope)
      const binding = new Binding({
        child: {},
        property (property) {
          if (map[property]) {
            const { content } = interpolateMustacheValues(attributeValue, scope)
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
  const map = enumerateMustacheValues(content, (startingIndex, outerWidth, name) => {
    content = spliceString(content, startingIndex, outerWidth, data[name])
    return content
  })
  return { content, map }
}

export function spliceString (string, start, length, value) {
  return `${string.slice(0, start)}${value}${string.slice(start + length)}`
}
