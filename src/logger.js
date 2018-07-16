export const logger = {
  log () {
    console.log.apply(console.log, arguments)
  },
  warn () {
    console.warn.apply(console.warn, arguments)
  },
  error () {
    console.error.apply(console.error, arguments)
  },
  info () {
    console.info.apply(console.info, arguments)
  }
}
