import { parse } from 'himalaya'
import { PropertyBinding, registerBinding, teardownBindings } from './binding'
import { directives } from './directives'

export const MAGIC_TAGS_REGEXP = /{{\s*([^}]+)\s*}}/

export const DIRECTIVE_PREFIX = 'm-'

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
  // TODO: use MutationObserver instead
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

    const binding = new PropertyBinding({
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
      const binding = new PropertyBinding({
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

export function interpolateMustacheValues (content, scope) {
  const map = enumerateMustacheValues(content,
    (startingIndex, outerWidth, name) => {
      content = spliceString(content, startingIndex, outerWidth, scope[name])
      return content
    }
  )
  return { content, map }
}

export function spliceString (string, start, length, value) {
  return `${string.slice(0, start)}${value}${string.slice(start + length)}`
}
