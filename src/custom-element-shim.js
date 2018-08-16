if (process.env.NODE_ENV !== 'test') {
  const BuiltInHTMLElement = HTMLElement
  window.HTMLElement = function HTMLElement () {
    return Reflect.construct(BuiltInHTMLElement, [], this.constructor)
  }
  HTMLElement.prototype = BuiltInHTMLElement.prototype
  HTMLElement.prototype.constructor = HTMLElement
  Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement)
}
