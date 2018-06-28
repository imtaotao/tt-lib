export const AudioCtx = new AudioContext()

export const platform = (() => {
  const browser = typeof window
  const node = typeof global
  const electron = browser && node

  return {
    browser,
    node,
    electron,
  }
})()

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

export function inlineWorker (func) {
  if (!(<any>window).Worker) {
    this.errorFn('Worker is undefined', true)
  }

  const functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1]
  const url = window.URL.createObjectURL(new window.Blob([functionBody], {
    type: 'text/javascript',
  }))
  return new (<any>window).Worker(url)
}

export function isString (string:any) {
  return Object.prototype.toString.call(string) === '[object String]'
}

export function isNumber (number:any) {
  return !Number.isNaN(number) && Object.prototype.toString.call(number) === '[object Number]'
}

export function isObject (object:any) {
  return Object.prototype.toString.call(object) === '[object Object]'
}

export function isFunction (func:any) {
  return Object.prototype.toString.call(func) === '[object Function]'
}

export function isClass (classBody:any) {
  return !isString(classBody) && String(classBody).slice(0, 5) === 'class'
}

export function isUndef (val:any) {
  return val === undefined || val === null
}