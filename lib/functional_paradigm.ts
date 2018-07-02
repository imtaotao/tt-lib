import { logError, isFunction } from './utils'

export function curry (fun:Function) : Function {
  if (!Function) {
    logError('FP', `[ fun ] must be a "function", but now is ${typeof fun}`)
  }

  return (...catchArgs) => (...args) => fun(...catchArgs, ...args)
}