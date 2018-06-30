import { logError, isObject } from './utils'

class ResponseData {
  private originData: Object
  private responseCallback: Function
  private rewrite:string[]

  public constructor(data:Object | any[], responseCallback?:Function) {
    if (!isObject(data) && !Array.isArray(data)) {
      logError('Response data', `[ response data ] must be a "object" or "array", but now is a ${typeof data}`, true)
    }

    this.originData = data
    this.responseCallback = responseCallback || (() => {})
    // 改变源数组的 api 需要重写
    this.rewrite = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
    this.observe(data)
  }

  // 添加set/get属性
  observe(obj:Object, path?:string[]) {
    // 如果obj是数组，重写obj的原型对象
    if (Array.isArray(obj)) {
      this.definedArrayProto(obj, path)
    }

    // es6 let 拥有块级作用域，for 可以作为闭包使用
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue
      // 闭包保存值
      let oldVal = obj[key]
      let pathArr:any = path && path.slice(0)

      pathArr
        ? pathArr.push(key)
        : pathArr = [key]

      Object.defineProperty(obj, key, {
        set: (newVal:any) => {
          if (newVal === oldVal) return

          if (isObject(newVal) || Array.isArray(newVal)) {
            this.observe(newVal, pathArr)
          }

          this.responseCallback(newVal, oldVal, this.join(pathArr))
          oldVal = newVal
        },
        get: () => oldVal
      })

      // 子项如果是对象或者数组，递归进行绑定
      if (isObject(oldVal) || Array.isArray(oldVal)) {
        this.observe(oldVal, pathArr)
      }
    }
  }

  // 重写数组的prototype
  definedArrayProto (array:any[], path?:string[]) {
    const _self = this
    let originProto = Array.prototype
    let definedProto = Object.create(originProto)

    for (let i = 0; i < this.rewrite.length; i++) {
      const methodName = this.rewrite[i]

      // 重写改方法，本质上写了个高阶函数作代理
      Object.defineProperty(definedProto, methodName, {
        value (...args) {
          // this 为当前数组（值）
          let oldArray = this.slice(0)

          // 调用原生数组方法, this 为数组，为引用类型，当改变 this 值，此处指自动更新
          let result = originProto[methodName].apply(this, args)

          _self.observe(this, path)
          _self.responseCallback(this, oldArray, null)

          return result
        },
        writable: true,
        enumerable: false,
        configurable: true,
      })
    }

    // 当前数组实例改变继承
    Object.setPrototypeOf(array, definedProto)
  }

  join (array:string[]) : string {
    return `['${array.join("']['")}']`
  }
}

export function createResponseData (data:Object | any[], responseCallback?:Function) {
  new ResponseData(data, responseCallback)
}