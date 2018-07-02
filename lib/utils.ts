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

// 16进制颜色转为rgb颜色
export function hexToRgb (hex:string, opacity?:number, noCheck?:boolean) : number[] {
  if (!noCheck && !isString(hex)) {
    logError('Utils', `[ hex ] must be a "string", but now is ${typeof hex}`, true)
  }
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  let color = hex.toLowerCase()
  
  if (!noCheck && (!color || !reg.test(color))) {
    logError('Utils', '[ hex ] does not meet the requirements', true)
  }

  // 先转化为六位的颜色值
  if (color.length === 4) {
    let newColorStr = '#'
    for (let i = 1; i < 4; i++) {
      const s = color.slice(i, i+1)
      newColorStr += s.concat(s)
    }
    color = newColorStr
  }

  //处理六位的颜色值（'0x'代表的就是十六进制）
  const colorArr:any = []
  for (let j = 1; j < 7; j += 2) {
    colorArr.push(parseInt('0x' + color.slice(j, j+2)))
  }

  isNumber(opacity) && colorArr.push(opacity)
  
  return colorArr
}

// rgb(a)颜色转为16进制颜色
export function rgbToHex (rgb:string, noCheck?:boolean) : string {
  if (!noCheck && !isString(rgb)) {
    logError('Utils', `[ rgb(a) ] must be a "string", but now is ${typeof rgb}`, true)
  }
  if (!noCheck && !/^(rgb(a?)|RGB(A?))/.test(rgb)) {
    logError('Utils', '[ rgb(a) ] does not meet the requirements', true)
  }

  const rgbArr:any = rgb.replace(/(?:\(|\)|rgb(a?)|RGB(A?))*/g, '').split(',')
  let hexStr = '#'

  // 透明度
  if (rgbArr.length === 4) {
    rgbArr.push(Math.round(rgbArr.splice(3, 1)[0] * 255))
  }
  
  for (var i = 0; i < rgbArr.length; i++) {
    let hex = Number(rgbArr[i]).toString(16)
    if (hex.length < 2) {
      hex = '0' + hex
    }
    hexStr += hex
  }

  return hexStr
}