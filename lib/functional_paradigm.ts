import { logError, isUndef } from './utils'

export function curry (fun:Function) : Function {
  const length = (<any>fun)._length || fun.length
  let catchArgs:any[] = []

  return function loadFun (...args) {
    const lastLen = length - catchArgs.length
    const currentLen = args.length
    if (lastLen < currentLen) {
      logError('FP', `The argument should be "${length}", but the result is "${catchArgs.length + args.length}"`, true)
    }

    if (lastLen === currentLen) {
      return fun(...catchArgs, ...args)
    }
    catchArgs = catchArgs.concat(args)

    return loadFun
  }
}

export function compose (...funArgs:Function[]) : Function {
  return function (...args:any[]) {
    let length = funArgs.length
    let result = args
    let initEnv = true

    while (length--) {
      result = initEnv
        ? funArgs[length](...result)
        : funArgs[length](result)

      initEnv && (initEnv = false)
    }

    return result
  }
}

export function prop (key:any) : Function {
  return curry((prop:any, obj:Object) => obj[prop])(key)
}

// 容器
export class Container {
  private _value:any
  public constructor (x:any) {
    this._value = x
  }

  public map (fun:Function) : Container {
    return new Container(fun(this._value))
  }

  public isUndef () {
    return isUndef(this._value)
  }

  public maybeMap (fun:Function): Container {
    return isUndef(this._value)
      ? new Container(this._value)
      : new Container(fun(this._value))
  }

  static
  of (x:any) : Container {
    return new Container(x)
  }

  static
  maybe (val:any, fun:Function) {
    const curryFun = curry((val:any, fun:Function, container:Container) => {
      return container.isUndef() ? val : fun(container._value)
    })

    return curryFun(val, fun)
  }
}