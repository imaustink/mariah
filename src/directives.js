import { PropertyBinding, ObjectBinding, registerBinding, addEventListener, teardownBindings } from './binding'
import { renderFragmentFromAST, removeNode } from './renderer'
import { ObservableObject } from './observables'

const CLASSES_DEF_REGEXP = /,\s?/g
const CLASS_DEF_REGEXP = /:\s?/

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
  attr (targetElement, attributeName, scopeKey, scope) {
    const binding = new PropertyBinding({
      child: {},
      property (event, value) {
        if (value) {
          if (typeof value === 'string') {
            targetElement.setAttribute(attributeName, value)
          } else {
            targetElement.setAttribute(attributeName, '')
          }
        } else {
          targetElement.removeAttribute(attributeName)
        }
      }
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
  class (targetElement, _, classes, scope) {
    const classMap = {}
    function update (event, property, value) {
      const className = classMap[property]
      if (className) {
        if (value) {
          targetElement.classList.add(className)
        } else {
          targetElement.classList.remove(className)
        }
      }
    }
    const classDefinitions = classes.split(CLASSES_DEF_REGEXP)
    for (let i = 0; i < classDefinitions.length; i++) {
      const [ className, scopeKey ] = classDefinitions[i].split(CLASS_DEF_REGEXP)
      classMap[scopeKey] = className
      update(undefined, scopeKey, scope[scopeKey])
    }

    const binding = new PropertyBinding({
      child: {},
      property: update
    },
    {
      parent: scope,
      property: 'change'
    },
    {
      type: 'from'
    })

    registerBinding(targetElement, binding)
  },
  on (targetElement, eventName, scopeKey, scope) {
    addEventListener(targetElement, eventName, function (event) {
      const value = scope[scopeKey]
      if (typeof value === 'function') {
        value.call(scope, event, scope)
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
      const childScope = new ObservableObject({ $index: index, $value: value })
      const element = renderFragmentFromAST([nodeInfo], childScope).firstChild
      if (typeof value === 'object') {
        const scopedBinding = new ObjectBinding(childScope, value, { type: 'from' })
        registerBinding(element, scopedBinding)
      }
      // TODO: this ia a bad and ugly solution. I need something better here
      const parentBinding = new ObjectBinding(childScope, scope, { type: 'from' })
      registerBinding(element, parentBinding)

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
