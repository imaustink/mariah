import { PropertyBinding, ObjectBinding, registerBinding, addEventListener, teardownBindings } from './binding'
import { renderFragmentFromAST, removeNode } from './renderer'
import { ObservableObject } from './observables'

export const directives = {
  bind (targetElement, childProp, scopeKey, scope) {
    function updateViewModel () {
      scope[scopeKey] = targetElement[childProp]
    }
    function updateElement (event, value) {
      targetElement[childProp] = value
    }
    if (targetElement.viewModel) {
      // TODO: setup bindings from scope to the custom element's VM here
    } else {
      // TODO: implement select, check, textarea
      addEventListener(targetElement, 'input', updateViewModel)
      if (targetElement.value) {
        updateViewModel()
      }

      const binding = new PropertyBinding({
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
    const binding = new PropertyBinding({
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

    function add (value, index) {
      const scope = new ObservableObject({ $index: index, $value: value })
      const element = renderFragmentFromAST([nodeInfo], scope).firstChild
      if (typeof value === 'object') {
        const binding = new ObjectBinding(scope, value, { type: 'from' })
        registerBinding(element, binding)
      }

      if (indexMap[index]) {
        const currentElement = indexMap[index]
        elementMap.delete(currentElement)
        elementMap.set(element, index)
        indexMap[index] = element
        placeholder.parentNode.replaceChild(element, currentElement)
        teardownBindings(currentElement)
      } else {
        elementMap.set(element, index)
        indexMap[index] = element
        // TODO this needs to be fixed for objects to work
        placeholder.parentNode.appendChild(element)
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
      for (let key in value._data) {
        if (value.hasOwnProperty(key)) {
          add(value._data[key], key)
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
    // Need to improve PropertyBinding before this is possible
  }
}
