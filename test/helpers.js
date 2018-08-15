export function getElementsByTagName (target, tagName) {
  const matches = []
  const children = target.childNodes
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.tagName && child.tagName.toLowerCase() === tagName.toLowerCase()) {
      matches.push(child)
    }
    if (child.childNodes && child.childNodes.length) {
      matches.push(...getElementsByTagName(child, tagName))
    }
  }
  return matches
}
