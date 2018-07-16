import { parse } from 'himalaya'
import { Component } from './component'
import { Binding } from './binding'
import { logger } from './logger'
import { ObservableObject } from './observables'

export const MAGIC_TAGS_REGEXP = /{{\s*([^}]+)\s*}}/

export const DIRECTIVE_PREFIX = 'm-'

export const directives = {
  bind (targetElement, childProp, parentProp, scope) {
    // TODO setup bindings from scope to the custom element's VM here
    if (targetElement._vm) {

    } else {

    }
  },
  on (targetElement, eventName, scopeKey, scope) {
    const value = scope[scopeKey]
    addEventListener(targetElement, eventName, function (event) {
      if (typeof value === 'function') {
        value(event)
      }
    })
  },
  if (targetElement, _, scopeKey, scope) {
    const placeholder = document.createTextNode('')
    function update (value) {
      if (value) {
        targetElement.parentNode.replaceChild(targetElement, placeholder)
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
  },
  for (targetElement, _, scopeKey, scope) {
    const itemMap = new Map()
    const value = scope[scopeKey]
    const parent = targetElement.parentNode

    parent.removeChild(targetElement)

    function add (item, index) {
      if (itemMap.has(item)) {

      } else {
        itemMap.set(
          item,
          value
        )
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
export function renderFragmentFromAST (ast, scope, parent = document.createDocumentFragment()) {
  for (let i = 0; i < ast.length; i++) {
    const nodeInfo = ast[i]

    switch (nodeInfo.type) {
      case 'element':
        let element = createElement(nodeInfo.tagName)

        parent.appendChild(element)

        if (nodeInfo.attributes && nodeInfo.attributes.length) {
          // TODO: building my own parser would mean I could avoid things like this
          const attributes = convertAttributesListToMap(nodeInfo.attributes)
          setupLiveElementBindings(element, attributes, scope)
        }
        if (nodeInfo.children.length) {
          element.appendChild(renderFragmentFromAST(nodeInfo.children, scope, parent))
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

export function convertAttributesListToMap (attributes) {
  const map = {}

  for (let i = 0; i < attributes.length; i++) {
    let attribute = attributes[i]
    map[attribute.key] = attribute.value
  }

  return map
}

// Remove a node and cleanup any bindings on it
export function removeNode (node) {
  teardownBindings(node)
  node.remove()
}

// Create an element and setup binding to a scope
export function createElement (tagName) {
  const node = document.createElement(tagName)

  if (node instanceof Component) {
    node.appendChild(renderFragmentFromHTML(node.template, node._vm))
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

export function setupLiveElementBindings (element, attributes, scope) {
  const uniqueDirectivesUsed = {
    if: false,
    for: false
  }

  if (attributes[`${DIRECTIVE_PREFIX}for`]) {
    const key = attributes[`${DIRECTIVE_PREFIX}for`]
    delete attributes[`${DIRECTIVE_PREFIX}for`]
    directives.for(element, attributes, key, scope)
  }

  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i]
    if (attribute.key.startsWith(DIRECTIVE_PREFIX)) {
      const keyParts = attribute.key.slice(2).split(':')
      const directiveName = keyParts[0]
      const directiveValue = keyParts[1]
      const directive = directives[directiveName]
      if (uniqueDirectivesUsed[directiveName]) {
        throw new Error(`Conflicting directive found ${attribute.key}="${attribute.value}"!`)
      }
      if (typeof directive === 'function') {
        directive(element, directiveValue, attribute.value, scope)
        if (uniqueDirectivesUsed[directiveName] === false) {
          uniqueDirectivesUsed[directiveName] = true
        }
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
