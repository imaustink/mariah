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
  on (element, key, value, scope) {

  }
}

export const nodeBindings = new Map()

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
  let currentVariable

  // eslint-disable-next-line no-cond-assign
  while (currentVariable = MAGIC_TAGS_REGEXP.exec(content, 'gm')) {
    if (currentVariable) {
      const staringIndex = currentVariable.index
      const outerWidth = currentVariable[0].length
      const name = currentVariable[1]
      const value = scope[name]
      const prefix = content.slice(0, staringIndex)
      const liveNode = document.createTextNode(value)
      content = content.slice(staringIndex + outerWidth)

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
    }
  }

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
      const interpolation = new InterpolateMustacheValues(attribute.value, scope)
      const binding = new Binding({
        child: {},
        property (property, value) {
          interpolation.updateValue(property, value)
          element.setAttribute(attribute.key, interpolation.value)
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
      element.setAttribute(attribute.key, interpolation.value)
    }
  }
}

export class InterpolateMustacheValues {
  constructor (string, data) {
    let currentVariable

    // eslint-disable-next-line no-cond-assign
    while (currentVariable = MAGIC_TAGS_REGEXP.exec(string, 'gm')) {
      if (currentVariable) {
        const start = currentVariable.index
        const outerWidth = currentVariable[0].length
        const name = currentVariable[1]
        const value = data[name]
        const length = value.length
        this.positions[name] = {
          start,
          length
        }
        string = spliceString(string, start, outerWidth, value)
      }
    }
    this.value = string
  }

  updateValue (property, value) {
    const position = this.positions[property]
    if (position) {
      this.value = spliceString(this.value, position.start, position.length, value)
      console.log(this.value)
      position.length = value.length
    }
    return this.string
  }

  positions = {}

  value = ''
}

export function spliceString (string, start, length, value) {
  return `${string.slice(0, start)}${value}${string.slice(start + length)}`
}
