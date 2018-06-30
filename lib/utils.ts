import { initEnv } from './init_env'
export * from './response_data'

export const platform = (() => {
  const haveGlobal = typeof global === 'object'
  const haveBrowserWindow = typeof this.window === 'object'

  const browser = haveBrowserWindow && !haveGlobal
  const node = !browser && haveGlobal && global.constructor.name === 'Object'
  const webpack = !haveBrowserWindow && haveGlobal && global.constructor.name === 'Window'
  const electron = haveBrowserWindow && haveGlobal && global.constructor.name === 'Window'

  return {
    browser,
    node,
    electron,
    webpack,
  }
})()

initEnv()

export const AudioCtx = new AudioContext()

export function require (nodeModule) {
  return require(nodeModule)
}

export function isString (string:any) {
  return Object.prototype.toString.call(string) === '[object String]'
}

export function isNumber (number:any) : boolean {
  return !Number.isNaN(number) && Object.prototype.toString.call(number) === '[object Number]'
}

export function isBoolean (boolean:any) : boolean {
  return Object.prototype.toString.call(boolean) === '[object Boolean]'
}

export function isObject (object:any) : boolean {
  return Object.prototype.toString.call(object) === '[object Object]'
}

export function isFunction (func:any) : boolean {
  return Object.prototype.toString.call(func) === '[object Function]'
}

export function isClass (classBody:any) : boolean {
  return !isString(classBody) && String(classBody).slice(0, 5) === 'class'
}

export function isUndef (val:any) {
  return val === undefined || val === null
}

export function isElement (element:any) : boolean {
  return !!(element.nodeType && element !== document && element.nodeType === 1 && element.tagName)
}

export function logError (tipHead:string, infor:string, err = false, warn = false) {
  const msg = `[${tipHead} tip] --> ${infor}.\n`
  if (err) throw Error(msg)
  if (warn) return console.warn(msg)
  console.error(msg)
}

export function download (url:Blob | string, filename) {
  if (!isString(url)) {
    url = window.URL.createObjectURL(url)
  }

  let link = window.document.createElement('a')
  link.href = <string>url
  link.download = filename || 'download.wav'
  let click = document.createEvent('MouseEvents') as any
  (<any>click.initMouseEvent)('click', true, true)
  link.dispatchEvent(click)
}

export function inlineWorker (func) : Worker {
  if (!(<any>window).Worker) {
    this.errorFn('Worker is undefined', true)
  }

  const functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1]
  const url = window.URL.createObjectURL(new window.Blob([functionBody], {
    type: 'text/javascript',
  }))
  return new (<any>window).Worker(url)
}

export function normalNumber (val:number, max:number, min:number) : number {
  return Math.max(Math.min(val, max), min)
}

export function random (max = 100000, min = 0, fractionDigits = 0) : number {
  return +(Math.random() * (max - min) + min).toFixed(fractionDigits) as any
}

export function randomString (range = 16) : string {
  const chartStr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIGKMLNOPQRSTUVWSYZ_!~@#$%^&*()+=-><,.?/'
  let string = ''

  for (let i = 0; i < range; i++) {
    string += chartStr[parseInt(<any>(Math.random() * chartStr.length))]
  }

  return string
}