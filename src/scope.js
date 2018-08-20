export class Scope {
  constructor (...scopes) {
    for (let i = 0; i < scopes.length; i++) {
      this.add(scopes[i])
    }
  }
  set (property, value) {
    this.scopes[0][property] = value
    return this.scopes[0]
  }
  get (property) {
    for (let i = 0; i < this.scopes.length; i++) {
      if (this.scopes[i].hasOwnProperty(property)) {
        return this.scopes[i][property]
      }
    }
  }
  add (scope) {
    this.scopes.push(scope)
  }
  scopes = []
}
