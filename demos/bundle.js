/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startsWith = startsWith;
exports.endsWith = endsWith;
exports.stringIncludes = stringIncludes;
exports.isRealNaN = isRealNaN;
exports.arrayIncludes = arrayIncludes;
/*
  We don't want to include babel-polyfill in our project.
    - Library authors should be using babel-runtime for non-global polyfilling
    - Adding babel-polyfill/-runtime increases bundle size significantly

  We will include our polyfill instance methods as regular functions.
*/

function startsWith(str, searchString, position) {
  return str.substr(position || 0, searchString.length) === searchString;
}

function endsWith(str, searchString, position) {
  var index = (position || str.length) - searchString.length;
  var lastIndex = str.lastIndexOf(searchString, index);
  return lastIndex !== -1 && lastIndex === index;
}

function stringIncludes(str, searchString, position) {
  return str.indexOf(searchString, position || 0) !== -1;
}

function isRealNaN(x) {
  return typeof x === 'number' && isNaN(x);
}

function arrayIncludes(array, searchElement, position) {
  var len = array.length;
  if (len === 0) return false;

  var lookupIndex = position | 0;
  var isNaNElement = isRealNaN(searchElement);
  var searchIndex = lookupIndex >= 0 ? lookupIndex : len + lookupIndex;
  while (searchIndex < len) {
    var element = array[searchIndex++];
    if (element === searchElement) return true;
    if (isNaNElement && isRealNaN(element)) return true;
  }

  return false;
}
//# sourceMappingURL=compat.js.map


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableArray = exports.ObservableObject = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getAndHydrate = getAndHydrate;
exports.hydrate = hydrate;

var _eventEmitter = __webpack_require__(6);

var _symbols = __webpack_require__(7);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO: use revocable proxies
// TODO: don't hydrate observables

var ObservableObject = exports.ObservableObject = function (_EventEmitter) {
  _inherits(ObservableObject, _EventEmitter);

  // Using the Object constructor because of an issue in @skatejs/ssr (skatejs/skatejs#1464)
  // eslint-disable-next-line no-new-object
  function ObservableObject() {
    var _ret;

    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Object();

    _classCallCheck(this, ObservableObject);

    var _this = _possibleConstructorReturn(this, (ObservableObject.__proto__ || Object.getPrototypeOf(ObservableObject)).call(this));

    _this._data = Object.assign(properties, {
      on: _this.on,
      off: _this.off,
      emit: _this.emit
    });
    _this._proxy = new Proxy(_this._data, {
      set: function set(target, property, value) {
        var lastValue = target[property];
        var success = true;

        if (lastValue !== value) {
          value = hydrate.apply(undefined, arguments);

          Reflect.set(target, property, value);

          target.emit('change', { type: 'set' }, property, value, lastValue);
          target.emit(property, { type: 'set' }, value, lastValue);
        }

        return success;
      },
      get: function get(target, property) {
        if (property === '_data') {
          return this._data;
        }

        return getAndHydrate.apply(undefined, arguments);
      },
      deleteProperty: function deleteProperty(target, property) {
        var lastValue = target[property];

        target.emit('change', { type: 'delete' }, property, undefined, lastValue);
        target.emit(property, { type: 'delete' }, undefined, lastValue);

        return Reflect.deleteProperty.apply(Reflect, arguments);
      }
    });

    return _ret = _this._proxy, _possibleConstructorReturn(_this, _ret);
  }

  return ObservableObject;
}(_eventEmitter.EventEmitter);

var ObservableArray = exports.ObservableArray = function (_EventEmitter2) {
  _inherits(ObservableArray, _EventEmitter2);

  // Using the Array constructor because of an issue in @skatejs/ssr (skatejs/skatejs#1464)
  // eslint-disable-next-line no-array-constructor
  function ObservableArray() {
    var _ret2;

    var initial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Array();

    _classCallCheck(this, ObservableArray);

    var _this2 = _possibleConstructorReturn(this, (ObservableArray.__proto__ || Object.getPrototypeOf(ObservableArray)).call(this));

    _this2._data = Object.assign(initial, {
      on: _this2.on.bind(_this2),
      off: _this2.off.bind(_this2),
      emit: _this2.emit.bind(_this2)
    });
    _this2._proxy = new Proxy(_this2._data, {
      set: function set(target, property, value) {
        var lastValue = target[property];
        var success = true;
        if (lastValue !== value) {
          value = hydrate.apply(undefined, arguments);

          Reflect.set(target, property, value);

          if (property !== 'length') {
            target.emit('change', { type: 'set' }, property, value, lastValue);
            target.emit(property, { type: 'set' }, value, lastValue);
          }
        }

        return success;
      },
      get: function get(target, property) {
        if (property === '_data') {
          return this._data;
        }

        return getAndHydrate.apply(undefined, arguments);
      },
      deleteProperty: function deleteProperty(target, property) {
        var lastValue = target[property];

        target.emit('change', { type: 'delete' }, property, undefined, lastValue);
        target.emit(property, { type: 'delete' }, undefined, lastValue);

        return Reflect.deleteProperty.apply(Reflect, arguments);
      }
    });
    return _ret2 = _this2._proxy, _possibleConstructorReturn(_this2, _ret2);
  }

  return ObservableArray;
}(_eventEmitter.EventEmitter);

function getAndHydrate(target, property) {
  var value = Reflect.get.apply(Reflect, arguments);
  value = hydrate(target, property, value);
  Reflect.set(target, property, value);
  return value;
}

function hydrate(target, property, value) {
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !value[_symbols.isObservableSymbol]) {
    if (Array.isArray(value)) {
      value = new ObservableArray(value);
    } else {
      value = new ObservableObject(value);
    }
    value[_symbols.isObservableSymbol] = true;
  }
  return value;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DIRECTIVE_PREFIX = exports.MAGIC_TAGS_REGEXP = undefined;
exports.render = render;
exports.renderFragmentFromHTMLString = renderFragmentFromHTMLString;
exports.renderFragmentFromAST = renderFragmentFromAST;
exports.removeNode = removeNode;
exports.createLiveTextFragment = createLiveTextFragment;
exports.createLiveElement = createLiveElement;
exports.enumerateMustacheValues = enumerateMustacheValues;
exports.interpolateMustacheValues = interpolateMustacheValues;
exports.spliceString = spliceString;

var _himalaya = __webpack_require__(8);

var _binding = __webpack_require__(3);

var _directives = __webpack_require__(14);

var MAGIC_TAGS_REGEXP = exports.MAGIC_TAGS_REGEXP = /{{\s*([^}]+)\s*}}/;

var DIRECTIVE_PREFIX = exports.DIRECTIVE_PREFIX = 'm-';

function render(template, scope) {
  // TODO: should support <template> tags
  if (typeof template === 'string') {
    return renderFragmentFromHTMLString(template, scope);
  }
  if (template instanceof HTMLElement && template.tagName === 'SCRIPT') {
    return renderFragmentFromHTMLString(template.textContent, scope);
  }
}

// Parse a template into an AST and render it
function renderFragmentFromHTMLString(template, scope) {
  var ast = (0, _himalaya.parse)(template);

  return renderFragmentFromAST(ast, scope);
}

// Render from a DOM AST
function renderFragmentFromAST(ast, scope) {
  var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.createDocumentFragment();

  for (var i = 0; i < ast.length; i++) {
    var nodeInfo = ast[i];

    switch (nodeInfo.type) {
      case 'element':
        var element = createLiveElement(nodeInfo, scope);

        parent.appendChild(element);

        if (nodeInfo.children.length) {
          element.appendChild(renderFragmentFromAST(nodeInfo.children, scope));
        }
        break;
      case 'text':
        var node = createLiveTextFragment(nodeInfo.content, scope);
        parent.appendChild(node);
        break;
    }
  }

  return parent;
}

// Remove a node and cleanup any bindings on it
function removeNode(node) {
  // TODO: use MutationObserver instead
  (0, _binding.teardownBindings)(node);
  node.remove();
}

// Breaks up a string where variables are found and replace them with live bound text nodes
function createLiveTextFragment(content, scope) {
  var fragment = document.createDocumentFragment();

  enumerateMustacheValues(content, function (startingIndex, outerWidth, name) {
    var value = scope[name];
    var prefix = content.slice(0, startingIndex);
    var liveNode = document.createTextNode(value);
    content = content.slice(startingIndex + outerWidth);

    if (prefix.length > 1) {
      fragment.appendChild(document.createTextNode(prefix));
    }
    fragment.appendChild(liveNode);

    var binding = new _binding.PropertyBinding({
      child: liveNode,
      property: 'nodeValue'
    }, {
      parent: scope,
      property: name
    }, {
      type: 'from'
    });

    (0, _binding.registerBinding)(liveNode, binding);

    return content;
  });

  if (content) {
    fragment.appendChild(document.createTextNode(content));
  }

  return fragment;
}

function createLiveElement(nodeInfo, scope) {
  var tagName = nodeInfo.tagName,
      attributes = nodeInfo.attributes;
  // TODO: this is slow, building my own parser would mean I could avoid things like this

  var forDirectiveIndex = attributes.findIndex(function (attribute) {
    return attribute.key === DIRECTIVE_PREFIX + 'for';
  });

  if (forDirectiveIndex !== -1) {
    var scopeKey = attributes[forDirectiveIndex].value;
    attributes.splice(forDirectiveIndex, 1);
    return _directives.directives.for(nodeInfo, scopeKey, scope);
  }

  // TODO: Should pass nodeInfo to all directives
  var element = document.createElement(tagName);

  var _loop = function _loop(i) {
    var attribute = attributes[i];
    if (attribute.key.startsWith(DIRECTIVE_PREFIX)) {
      var keyParts = attribute.key.slice(2).split(':');
      var directiveName = keyParts[0];
      var directiveValue = keyParts[1];
      var directive = _directives.directives[directiveName];
      if (typeof directive === 'function') {
        directive(element, directiveValue, attribute.value, scope);
      }
    } else if (attribute.value) {
      var attributeValue = attribute.value;

      var _interpolateMustacheV = interpolateMustacheValues(attributeValue, scope),
          content = _interpolateMustacheV.content,
          map = _interpolateMustacheV.map;

      var binding = new _binding.PropertyBinding({
        child: {},
        property: function property(event, _property) {
          if (map[_property]) {
            var _interpolateMustacheV2 = interpolateMustacheValues(attributeValue, scope),
                _content = _interpolateMustacheV2.content;

            element.setAttribute(attribute.key, _content);
          }
        }
      }, {
        parent: scope,
        property: 'change'
      }, {
        type: 'from'
      });

      (0, _binding.registerBinding)(element, binding);
      element.setAttribute(attribute.key, content);
    }
  };

  for (var i = 0; i < attributes.length; i++) {
    _loop(i);
  }

  return element;
}

function enumerateMustacheValues(content, callback) {
  var map = {};
  var currentVariable = void 0;

  // eslint-disable-next-line no-cond-assign
  while (currentVariable = MAGIC_TAGS_REGEXP.exec(content, 'gm')) {
    if (currentVariable) {
      var staringIndex = currentVariable.index;
      var outerWidth = currentVariable[0].length;
      var name = currentVariable[1];

      content = callback(staringIndex, outerWidth, name);
      map[name] = true;
    }
  }

  return map;
}

function interpolateMustacheValues(content, scope) {
  var map = enumerateMustacheValues(content, function (startingIndex, outerWidth, name) {
    content = spliceString(content, startingIndex, outerWidth, scope[name]);
    return content;
  });
  return { content: content, map: map };
}

function spliceString(string, start, length, value) {
  return '' + string.slice(0, start) + value + string.slice(start + length);
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.addEventListener = addEventListener;
exports.registerBinding = registerBinding;
exports.teardownBindings = teardownBindings;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nodeBindings = exports.nodeBindings = new Map();

function addEventListener(element, name, handler) {
  element.addEventListener(name, handler);

  registerBinding(element, {
    teardown: function teardown() {
      element.removeEventListener(name, handler);
    }
  });
}

function registerBinding(node, binding) {
  var bindings = nodeBindings.get(node);

  if (bindings) {
    bindings.push(binding);
  } else {
    nodeBindings.set(node, [binding]);
  }
}

var BaseBinding = exports.BaseBinding = function () {
  function BaseBinding() {
    _classCallCheck(this, BaseBinding);

    this.handlers = new Map();
  }

  _createClass(BaseBinding, [{
    key: 'registerHandler',
    value: function registerHandler(source, handler) {
      this.handlers.set(source, handler);
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      this.handlers.forEach(function (handler, source) {
        source.off(handler);
      });
      this.handlers.clear();
    }
  }]);

  return BaseBinding;
}();

// Recursively traverse the a DOM tree and teardown all bindings


function teardownBindings(node) {
  var bindings = nodeBindings.get(node);
  var childNodes = node.childNodes;
  if (bindings) {
    for (var i = 0; i < bindings.length; i++) {
      bindings[i].teardown();
    }
    nodeBindings.delete(node);
  }
  if (childNodes && childNodes.length) {
    for (var _i = 0; _i < childNodes.length; _i++) {
      teardownBindings(childNodes[_i]);
    }
  }
}

var PropertyBinding = exports.PropertyBinding = function (_BaseBinding) {
  _inherits(PropertyBinding, _BaseBinding);

  function PropertyBinding(cc, pc, _ref) {
    var type = _ref.type;

    _classCallCheck(this, PropertyBinding);

    var _this = _possibleConstructorReturn(this, (PropertyBinding.__proto__ || Object.getPrototypeOf(PropertyBinding)).call(this));

    switch (type) {
      case 'bind':
        _this.bind(pc.parent, pc.property, cc.child, cc.property, true);
        _this.bind(cc.child, cc.property, pc.parent, pc.property);
        break;
      case 'to':
        _this.bind(cc.child, cc.property, pc.parent, pc.property, true);
        break;
      case 'from':
        _this.bind(pc.parent, pc.property, cc.child, cc.property, true);
        break;
    }
    return _this;
  }

  _createClass(PropertyBinding, [{
    key: 'bind',
    value: function bind(source, sourceProperty, target, targetProperty, initialize) {
      var isCustomHandler = typeof targetProperty === 'function';
      var handler = isCustomHandler && targetProperty || function (event, value) {
        target[targetProperty] = value;
      };

      if (initialize) {
        handler(null, source[sourceProperty], target[targetProperty]);
      }
      source.on(sourceProperty, handler);

      this.registerHandler(source, handler);
    }
  }]);

  return PropertyBinding;
}(BaseBinding);

var ObjectBinding = exports.ObjectBinding = function (_BaseBinding2) {
  _inherits(ObjectBinding, _BaseBinding2);

  function ObjectBinding(child, parent, _ref2) {
    var _ref2$type = _ref2.type,
        type = _ref2$type === undefined ? 'bind' : _ref2$type;

    _classCallCheck(this, ObjectBinding);

    var _this2 = _possibleConstructorReturn(this, (ObjectBinding.__proto__ || Object.getPrototypeOf(ObjectBinding)).call(this));

    switch (type) {
      case 'bind':
        _this2.bind(parent, child, true);
        _this2.bind(child, parent);
        break;
      case 'to':
        _this2.bind(child, parent, true);
        break;
      case 'from':
        _this2.bind(parent, child, true);
        break;
    }
    return _this2;
  }

  _createClass(ObjectBinding, [{
    key: 'bind',
    value: function bind(from, to, initialize) {
      if (initialize) {
        Object.assign(to, from);
      }
      var handler = function handler(event, property, value) {
        switch (event.type) {
          case 'set':
            to[property] = value;
            break;
          case 'delete':
            delete to[property];
            break;
        }
      };
      from.on('change', handler);

      this.registerHandler(from, handler);
    }
  }]);

  return ObjectBinding;
}(BaseBinding);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _component = __webpack_require__(5);

_component.Component.create({
  tag: 'my-component',
  template: '\n    <form m-on:submit="addItem">\n      <input m-bind:value="itemName">\n      <button type="submit">Create Todo</button>\n    </form>\n    <ul>\n      <li m-for="items">\n        {{$value}}\n        <button m-on:click="deleteItem">x</button>\n      </li>\n    </ul>\n  ',
  viewModel: {
    items: [],
    itemName: '',
    addItem: function addItem(event) {
      event.preventDefault();
      this.items.push(this.itemName);
      this.itemName = '';
    },
    deleteItem: function deleteItem(_ref, _ref2) {
      var target = _ref.target;
      var $index = _ref2.$index;

      this.items.splice($index, 1);
    }
  }
});

document.body.appendChild(document.createElement('my-component'));

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _observables = __webpack_require__(1);

var _renderer = __webpack_require__(2);

__webpack_require__(15);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = exports.Component = function (_HTMLElement) {
  _inherits(Component, _HTMLElement);

  function Component() {
    _classCallCheck(this, Component);

    var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this));

    _this.viewModel = new _observables.ObservableObject();

    if (_this.template !== undefined) {
      throw new Error('Component should be extended with a template instance property or getter!');
    }
    return _this;
  }

  _createClass(Component, [{
    key: 'childrenConnectedCallback',
    value: function childrenConnectedCallback() {}
  }, {
    key: 'connectedCallback',
    value: function connectedCallback() {
      var connectedCallback = this.viewModel.connectedCallback;
      if (typeof connectedCallback === 'function') {
        connectedCallback.apply(this, arguments);
      }
      this.appendChild((0, _renderer.render)(this.template, this.viewModel));
      this.childrenConnectedCallback();
    }
  }, {
    key: 'disconnectedCallback',
    value: function disconnectedCallback() {
      var disconnectedCallback = this.viewModel.disconnectedCallback;
      if (typeof disconnectedCallback === 'function') {
        disconnectedCallback.apply(this, arguments);
      }
      (0, _renderer.removeNode)(this);
    }
  }], [{
    key: 'create',


    // TODO: consider a decorator for this
    value: function create(_ref) {
      var tag = _ref.tag,
          template = _ref.template,
          viewModel = _ref.viewModel;

      if (typeof tag !== 'string' || !tag.includes('-')) {
        throw new Error('A valid tag must be provided to create a new Component!');
      }

      var CustomComponent = function (_Component) {
        _inherits(CustomComponent, _Component);

        function CustomComponent() {
          var _ref2;

          var _temp, _this2, _ret;

          _classCallCheck(this, CustomComponent);

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref2 = CustomComponent.__proto__ || Object.getPrototypeOf(CustomComponent)).call.apply(_ref2, [this].concat(args))), _this2), _this2.viewModel = new _observables.ObservableObject(viewModel), _this2.template = template, _temp), _possibleConstructorReturn(_this2, _ret);
        }

        return CustomComponent;
      }(Component);

      customElements.define(tag, CustomComponent);

      return CustomComponent;
    }
  }]);

  return Component;
}(HTMLElement);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = exports.EventEmitter = function EventEmitter() {
  var _this = this;

  _classCallCheck(this, EventEmitter);

  this.on = function (name, handler) {
    if (!_this.handlers[name]) {
      _this.handlers[name] = new Map();
    }
    _this.handlers[name].set(handler, handler);
  };

  this.off = function (name, handler) {
    var handlers = _this.handlers[name];
    if (handlers) {
      handlers.delete(handler);
    }
  };

  this.emit = function (name) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var handlers = _this.handlers[name];
    if (handlers) {
      handlers.forEach(function (handler) {
        return handler.apply(undefined, args);
      });
    }
  };

  this.handlers = {};
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var viewModelSymbol = exports.viewModelSymbol = Symbol.for('Mariah.viewModel');
var isObservableSymbol = exports.isObservableSymbol = Symbol.for('Mariah.isObservable');

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDefaults = undefined;
exports.parse = parse;
exports.stringify = stringify;

var _lexer = __webpack_require__(9);

var _lexer2 = _interopRequireDefault(_lexer);

var _parser = __webpack_require__(10);

var _parser2 = _interopRequireDefault(_parser);

var _format = __webpack_require__(11);

var _stringify = __webpack_require__(12);

var _tags = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseDefaults = exports.parseDefaults = {
  voidTags: _tags.voidTags,
  closingTags: _tags.closingTags,
  childlessTags: _tags.childlessTags,
  closingTagAncestorBreakers: _tags.closingTagAncestorBreakers,
  includePositions: false
};

function parse(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : parseDefaults;

  var tokens = (0, _lexer2.default)(str, options);
  var nodes = (0, _parser2.default)(tokens, options);
  return (0, _format.format)(nodes, options);
}

function stringify(ast) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : parseDefaults;

  return (0, _stringify.toHTML)(ast, options);
}
//# sourceMappingURL=index.js.map


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.feedPosition = feedPosition;
exports.jumpPosition = jumpPosition;
exports.makeInitialPosition = makeInitialPosition;
exports.copyPosition = copyPosition;
exports.default = lexer;
exports.lex = lex;
exports.findTextEnd = findTextEnd;
exports.lexText = lexText;
exports.lexComment = lexComment;
exports.lexTag = lexTag;
exports.isWhitespaceChar = isWhitespaceChar;
exports.lexTagName = lexTagName;
exports.lexTagAttributes = lexTagAttributes;
exports.lexSkipTag = lexSkipTag;

var _compat = __webpack_require__(0);

function feedPosition(position, str, len) {
  var start = position.index;
  var end = position.index = start + len;
  for (var i = start; i < end; i++) {
    var char = str.charAt(i);
    if (char === '\n') {
      position.line++;
      position.column = 0;
    } else {
      position.column++;
    }
  }
}

function jumpPosition(position, str, end) {
  var len = end - position.index;
  return feedPosition(position, str, len);
}

function makeInitialPosition() {
  return {
    index: 0,
    column: 0,
    line: 0
  };
}

function copyPosition(position) {
  return {
    index: position.index,
    line: position.line,
    column: position.column
  };
}

function lexer(str, options) {
  var state = {
    str: str,
    options: options,
    position: makeInitialPosition(),
    tokens: []
  };
  lex(state);
  return state.tokens;
}

function lex(state) {
  var str = state.str,
      childlessTags = state.options.childlessTags;

  var len = str.length;
  while (state.position.index < len) {
    var start = state.position.index;
    lexText(state);
    if (state.position.index === start) {
      var isComment = (0, _compat.startsWith)(str, '!--', start + 1);
      if (isComment) {
        lexComment(state);
      } else {
        var tagName = lexTag(state);
        var safeTag = tagName.toLowerCase();
        if ((0, _compat.arrayIncludes)(childlessTags, safeTag)) {
          lexSkipTag(tagName, state);
        }
      }
    }
  }
}

var alphanumeric = /[A-Za-z0-9]/;
function findTextEnd(str, index) {
  while (true) {
    var textEnd = str.indexOf('<', index);
    if (textEnd === -1) {
      return textEnd;
    }
    var char = str.charAt(textEnd + 1);
    if (char === '/' || char === '!' || alphanumeric.test(char)) {
      return textEnd;
    }
    index = textEnd + 1;
  }
}

function lexText(state) {
  var type = 'text';
  var str = state.str,
      position = state.position;

  var textEnd = findTextEnd(str, position.index);
  if (textEnd === position.index) return;
  if (textEnd === -1) {
    textEnd = str.length;
  }

  var start = copyPosition(position);
  var content = str.slice(position.index, textEnd);
  jumpPosition(position, str, textEnd);
  var end = copyPosition(position);
  state.tokens.push({ type: type, content: content, position: { start: start, end: end } });
}

function lexComment(state) {
  var str = state.str,
      position = state.position;

  var start = copyPosition(position);
  feedPosition(position, str, 4); // "<!--".length
  var contentEnd = str.indexOf('-->', position.index);
  var commentEnd = contentEnd + 3; // "-->".length
  if (contentEnd === -1) {
    contentEnd = commentEnd = str.length;
  }

  var content = str.slice(position.index, contentEnd);
  jumpPosition(position, str, commentEnd);
  state.tokens.push({
    type: 'comment',
    content: content,
    position: {
      start: start,
      end: copyPosition(position)
    }
  });
}

function lexTag(state) {
  var str = state.str,
      position = state.position;

  {
    var secondChar = str.charAt(position.index + 1);
    var close = secondChar === '/';
    var start = copyPosition(position);
    feedPosition(position, str, close ? 2 : 1);
    state.tokens.push({ type: 'tag-start', close: close, position: { start: start } });
  }
  var tagName = lexTagName(state);
  lexTagAttributes(state);
  {
    var firstChar = str.charAt(position.index);
    var _close = firstChar === '/';
    feedPosition(position, str, _close ? 2 : 1);
    var end = copyPosition(position);
    state.tokens.push({ type: 'tag-end', close: _close, position: { end: end } });
  }
  return tagName;
}

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-white-space
var whitespace = /\s/;
function isWhitespaceChar(char) {
  return whitespace.test(char);
}

function lexTagName(state) {
  var str = state.str,
      position = state.position;

  var len = str.length;
  var start = position.index;
  while (start < len) {
    var char = str.charAt(start);
    var isTagChar = !(isWhitespaceChar(char) || char === '/' || char === '>');
    if (isTagChar) break;
    start++;
  }

  var end = start + 1;
  while (end < len) {
    var _char = str.charAt(end);
    var _isTagChar = !(isWhitespaceChar(_char) || _char === '/' || _char === '>');
    if (!_isTagChar) break;
    end++;
  }

  jumpPosition(position, str, end);
  var tagName = str.slice(start, end);
  state.tokens.push({
    type: 'tag',
    content: tagName
  });
  return tagName;
}

function lexTagAttributes(state) {
  var str = state.str,
      position = state.position,
      tokens = state.tokens;

  var cursor = position.index;
  var quote = null; // null, single-, or double-quote
  var wordBegin = cursor; // index of word start
  var words = []; // "key", "key=value", "key='value'", etc
  var len = str.length;
  while (cursor < len) {
    var char = str.charAt(cursor);
    if (quote) {
      var isQuoteEnd = char === quote;
      if (isQuoteEnd) {
        quote = null;
      }
      cursor++;
      continue;
    }

    var isTagEnd = char === '/' || char === '>';
    if (isTagEnd) {
      if (cursor !== wordBegin) {
        words.push(str.slice(wordBegin, cursor));
      }
      break;
    }

    var isWordEnd = isWhitespaceChar(char);
    if (isWordEnd) {
      if (cursor !== wordBegin) {
        words.push(str.slice(wordBegin, cursor));
      }
      wordBegin = cursor + 1;
      cursor++;
      continue;
    }

    var isQuoteStart = char === '\'' || char === '"';
    if (isQuoteStart) {
      quote = char;
      cursor++;
      continue;
    }

    cursor++;
  }
  jumpPosition(position, str, cursor);

  var wLen = words.length;
  var type = 'attribute';
  for (var i = 0; i < wLen; i++) {
    var word = words[i];
    var isNotPair = word.indexOf('=') === -1;
    if (isNotPair) {
      var secondWord = words[i + 1];
      if (secondWord && (0, _compat.startsWith)(secondWord, '=')) {
        if (secondWord.length > 1) {
          var newWord = word + secondWord;
          tokens.push({ type: type, content: newWord });
          i += 1;
          continue;
        }
        var thirdWord = words[i + 2];
        i += 1;
        if (thirdWord) {
          var _newWord = word + '=' + thirdWord;
          tokens.push({ type: type, content: _newWord });
          i += 1;
          continue;
        }
      }
    }
    if ((0, _compat.endsWith)(word, '=')) {
      var _secondWord = words[i + 1];
      if (_secondWord && !(0, _compat.stringIncludes)(_secondWord, '=')) {
        var _newWord3 = word + _secondWord;
        tokens.push({ type: type, content: _newWord3 });
        i += 1;
        continue;
      }

      var _newWord2 = word.slice(0, -1);
      tokens.push({ type: type, content: _newWord2 });
      continue;
    }

    tokens.push({ type: type, content: word });
  }
}

var push = [].push;

function lexSkipTag(tagName, state) {
  var str = state.str,
      position = state.position,
      tokens = state.tokens;

  var safeTagName = tagName.toLowerCase();
  var len = str.length;
  var index = position.index;
  while (index < len) {
    var nextTag = str.indexOf('</', index);
    if (nextTag === -1) {
      lexText(state);
      break;
    }

    var tagStartPosition = copyPosition(position);
    jumpPosition(tagStartPosition, str, nextTag);
    var tagState = { str: str, position: tagStartPosition, tokens: [] };
    var name = lexTag(tagState);
    if (safeTagName !== name.toLowerCase()) {
      index = tagState.position.index;
      continue;
    }

    if (nextTag !== position.index) {
      var textStart = copyPosition(position);
      jumpPosition(position, str, nextTag);
      tokens.push({
        type: 'text',
        content: str.slice(textStart.index, nextTag),
        position: {
          start: textStart,
          end: copyPosition(position)
        }
      });
    }

    push.apply(tokens, tagState.tokens);
    jumpPosition(position, str, tagState.position.index);
    break;
  }
}
//# sourceMappingURL=lexer.js.map


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parser;
exports.hasTerminalParent = hasTerminalParent;
exports.rewindStack = rewindStack;
exports.parse = parse;

var _compat = __webpack_require__(0);

function parser(tokens, options) {
  var root = { tagName: null, children: [] };
  var state = { tokens: tokens, options: options, cursor: 0, stack: [root] };
  parse(state);
  return root.children;
}

function hasTerminalParent(tagName, stack, terminals) {
  var tagParents = terminals[tagName];
  if (tagParents) {
    var currentIndex = stack.length - 1;
    while (currentIndex >= 0) {
      var parentTagName = stack[currentIndex].tagName;
      if (parentTagName === tagName) {
        break;
      }
      if ((0, _compat.arrayIncludes)(tagParents, parentTagName)) {
        return true;
      }
      currentIndex--;
    }
  }
  return false;
}

function rewindStack(stack, newLength, childrenEndPosition, endPosition) {
  stack[newLength].position.end = endPosition;
  for (var i = newLength + 1, len = stack.length; i < len; i++) {
    stack[i].position.end = childrenEndPosition;
  }
  stack.splice(newLength);
}

function parse(state) {
  var tokens = state.tokens,
      options = state.options;
  var stack = state.stack;

  var nodes = stack[stack.length - 1].children;
  var len = tokens.length;
  var cursor = state.cursor;

  while (cursor < len) {
    var token = tokens[cursor];
    if (token.type !== 'tag-start') {
      nodes.push(token);
      cursor++;
      continue;
    }

    var tagToken = tokens[++cursor];
    cursor++;
    var tagName = tagToken.content.toLowerCase();
    if (token.close) {
      var index = stack.length;
      var shouldRewind = false;
      while (--index > -1) {
        if (stack[index].tagName === tagName) {
          shouldRewind = true;
          break;
        }
      }
      while (cursor < len) {
        var endToken = tokens[cursor];
        if (endToken.type !== 'tag-end') break;
        cursor++;
      }
      if (shouldRewind) {
        rewindStack(stack, index, token.position.start, tokens[cursor - 1].position.end);
        break;
      } else {
        continue;
      }
    }

    var isClosingTag = (0, _compat.arrayIncludes)(options.closingTags, tagName);
    var shouldRewindToAutoClose = isClosingTag;
    if (shouldRewindToAutoClose) {
      var terminals = options.closingTagAncestorBreakers;

      shouldRewindToAutoClose = !hasTerminalParent(tagName, stack, terminals);
    }

    if (shouldRewindToAutoClose) {
      // rewind the stack to just above the previous
      // closing tag of the same name
      var currentIndex = stack.length - 1;
      while (currentIndex > 0) {
        if (tagName === stack[currentIndex].tagName) {
          rewindStack(stack, currentIndex, token.position.start, token.position.start);
          var previousIndex = currentIndex - 1;
          nodes = stack[previousIndex].children;
          break;
        }
        currentIndex = currentIndex - 1;
      }
    }

    var attributes = [];
    var attrToken = void 0;
    while (cursor < len) {
      attrToken = tokens[cursor];
      if (attrToken.type === 'tag-end') break;
      attributes.push(attrToken.content);
      cursor++;
    }

    cursor++;
    var children = [];
    var position = {
      start: token.position.start,
      end: attrToken.position.end
    };
    var elementNode = {
      type: 'element',
      tagName: tagToken.content,
      attributes: attributes,
      children: children,
      position: position
    };
    nodes.push(elementNode);

    var hasChildren = !(attrToken.close || (0, _compat.arrayIncludes)(options.voidTags, tagName));
    if (hasChildren) {
      var size = stack.push({ tagName: tagName, children: children, position: position });
      var innerState = { tokens: tokens, options: options, cursor: cursor, stack: stack };
      parse(innerState);
      cursor = innerState.cursor;
      var rewoundInElement = stack.length === size;
      if (rewoundInElement) {
        elementNode.position.end = tokens[cursor - 1].position.end;
      }
    }
  }
  state.cursor = cursor;
}
//# sourceMappingURL=parser.js.map


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitHead = splitHead;
exports.unquote = unquote;
exports.format = format;
exports.formatAttributes = formatAttributes;
function splitHead(str, sep) {
  var idx = str.indexOf(sep);
  if (idx === -1) return [str];
  return [str.slice(0, idx), str.slice(idx + sep.length)];
}

function unquote(str) {
  var car = str.charAt(0);
  var end = str.length - 1;
  var isQuoteStart = car === '"' || car === "'";
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end);
  }
  return str;
}

function format(nodes, options) {
  return nodes.map(function (node) {
    var type = node.type;
    var outputNode = type === 'element' ? {
      type: type,
      tagName: node.tagName.toLowerCase(),
      attributes: formatAttributes(node.attributes),
      children: format(node.children, options)
    } : { type: type, content: node.content };
    if (options.includePositions) {
      outputNode.position = node.position;
    }
    return outputNode;
  });
}

function formatAttributes(attributes) {
  return attributes.map(function (attribute) {
    var parts = splitHead(attribute.trim(), '=');
    var key = parts[0];
    var value = typeof parts[1] === 'string' ? unquote(parts[1]) : null;
    return { key: key, value: value };
  });
}
//# sourceMappingURL=format.js.map


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatAttributes = formatAttributes;
exports.toHTML = toHTML;

var _compat = __webpack_require__(0);

function formatAttributes(attributes) {
  return attributes.reduce(function (attrs, attribute) {
    var key = attribute.key,
        value = attribute.value;

    if (value === null) {
      return attrs + ' ' + key;
    }
    var quoteEscape = value.indexOf('\'') !== -1;
    var quote = quoteEscape ? '"' : '\'';
    return attrs + ' ' + key + '=' + quote + value + quote;
  }, '');
}

function toHTML(tree, options) {
  return tree.map(function (node) {
    if (node.type === 'text') {
      return node.content;
    }
    if (node.type === 'comment') {
      return '<!--' + node.content + '-->';
    }
    var tagName = node.tagName,
        attributes = node.attributes,
        children = node.children;

    var isSelfClosing = (0, _compat.arrayIncludes)(options.voidTags, tagName.toLowerCase());
    return isSelfClosing ? '<' + tagName + formatAttributes(attributes) + '>' : '<' + tagName + formatAttributes(attributes) + '>' + toHTML(children, options) + '</' + tagName + '>';
  }).join('');
}

exports.default = { toHTML: toHTML };
//# sourceMappingURL=stringify.js.map


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
  Tags which contain arbitary non-parsed content
  For example: <script> JavaScript should not be parsed
*/
var childlessTags = exports.childlessTags = ['style', 'script', 'template'];

/*
  Tags which auto-close because they cannot be nested
  For example: <p>Outer<p>Inner is <p>Outer</p><p>Inner</p>
*/
var closingTags = exports.closingTags = ['html', 'head', 'body', 'p', 'dt', 'dd', 'li', 'option', 'thead', 'th', 'tbody', 'tr', 'td', 'tfoot', 'colgroup'];

/*
  Closing tags which have ancestor tags which
  may exist within them which prevent the
  closing tag from auto-closing.
  For example: in <li><ul><li></ul></li>,
  the top-level <li> should not auto-close.
*/
var closingTagAncestorBreakers = exports.closingTagAncestorBreakers = {
  li: ['ul', 'ol', 'menu'],
  dt: ['dl'],
  dd: ['dl'],
  tbody: ['table'],
  thead: ['table'],
  tfoot: ['table'],
  tr: ['table'],
  td: ['table']
};

/*
  Tags which do not need the closing tag
  For example: <img> does not need </img>
*/
var voidTags = exports.voidTags = ['!doctype', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
//# sourceMappingURL=tags.js.map


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.directives = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _binding = __webpack_require__(3);

var _renderer = __webpack_require__(2);

var _observables = __webpack_require__(1);

var directives = exports.directives = {
  bind: function bind(targetElement, childProp, scopeKey, scope) {
    function updateViewModel() {
      scope[scopeKey] = targetElement[childProp];
    }
    function updateElement(event, value) {
      targetElement[childProp] = value;
    }
    if (targetElement.viewModel) {
      // TODO: setup bindings from scope to the custom element's VM here
    } else {
      // TODO: implement select, check, textarea
      (0, _binding.addEventListener)(targetElement, 'input', updateViewModel);
      if (targetElement.value) {
        updateViewModel();
      }

      var binding = new _binding.PropertyBinding({
        child: {},
        property: updateElement
      }, {
        parent: scope,
        property: scopeKey
      }, {
        type: 'from'
      });

      (0, _binding.registerBinding)(targetElement, binding);
    }
  },
  on: function on(targetElement, eventName, scopeKey, scope) {
    (0, _binding.addEventListener)(targetElement, eventName, function (event) {
      var value = scope[scopeKey];
      if (typeof value === 'function') {
        value.call(scope, event, scope);
      }
    });
  },
  if: function _if(targetElement, _, scopeKey, scope) {
    var placeholder = document.createTextNode('');
    var frag = document.createDocumentFragment();

    frag.appendChild(placeholder);

    function update(event, value) {
      if (value) {
        placeholder.parentNode.replaceChild(targetElement, placeholder);
      } else {
        targetElement.parentNode.replaceChild(placeholder, targetElement);
      }
    }
    var binding = new _binding.PropertyBinding({
      child: {},
      property: update
    }, {
      parent: scope,
      property: scopeKey
    }, {
      type: 'from'
    });

    (0, _binding.registerBinding)(targetElement, binding);

    return frag;
  },
  for: function _for(nodeInfo, scopeKey, scope) {
    var elementMap = new Map();
    var indexMap = {};
    var value = scope[scopeKey];
    var frag = document.createDocumentFragment();
    var placeholder = document.createTextNode('');

    frag.appendChild(placeholder);

    function add(value, index) {
      var childScope = new _observables.ObservableObject({ $index: index, $value: value });
      var element = (0, _renderer.renderFragmentFromAST)([nodeInfo], childScope).firstChild;
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        var scopedBinding = new _binding.ObjectBinding(childScope, value, { type: 'from' });
        (0, _binding.registerBinding)(element, scopedBinding);
      }
      // TODO: this ia a bad and ugly solution. I need something better here
      var parentBinding = new _binding.ObjectBinding(childScope, scope, { type: 'from' });
      (0, _binding.registerBinding)(element, parentBinding);

      if (indexMap[index]) {
        var currentElement = indexMap[index];
        elementMap.delete(currentElement);
        elementMap.set(element, index);
        indexMap[index] = element;
        placeholder.parentNode.replaceChild(element, currentElement);
        (0, _binding.teardownBindings)(currentElement);
      } else {
        elementMap.set(element, index);
        indexMap[index] = element;
        // TODO this needs to be fixed for objects to work
        placeholder.parentNode.appendChild(element);
      }
    }

    function remove(index) {
      var element = indexMap[index];
      if (element) {
        (0, _renderer.removeNode)(element);
        // TODO this needs to be fixed for objects to work
        while (indexMap[index]) {
          var nextElement = indexMap[index + 1];
          indexMap[index] = nextElement;
          if (nextElement) {
            elementMap.set(nextElement, index);
          }
          index++;
        }
      }
    }

    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        add(value[i], i);
      }
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      for (var key in value._data) {
        if (value.hasOwnProperty(key)) {
          add(value._data[key], key);
        }
      }
    }

    value.on('change', function (event, property, value) {
      if (event.type === 'set') {
        add(value, property);
      } else if (event.type === 'delete') {
        remove(property);
      }
    });

    return frag;

    // TODO: Register binding to parent
    // Need to improve PropertyBinding before this is possible
  }
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (true) {
  var BuiltInHTMLElement = HTMLElement;
  window.HTMLElement = function HTMLElement() {
    return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
  };
  HTMLElement.prototype = BuiltInHTMLElement.prototype;
  HTMLElement.prototype.constructor = HTMLElement;
  Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
}

/***/ })
/******/ ]);