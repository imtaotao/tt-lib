import { isObject, isString, logError } from './utils'

export function jsonp (url:string, options:{
    data?:any
    timeout?:any
    callbackName?:string
}) : Promise<any> {
  if (!isString(url)) logError('Net', `[ JSONP url ] must be a "string", but now is ${typeof url}`, true)
  return new Promise((resolve, reject) => {
    const {
        data = '',
        timeout = 10000,
        callbackName = 'jsonp' + Date.now()
    } = options || {}

    const script = document.createElement('script')
    const type = url.includes('?') ? '&' : '?'

    let timeoutFlag = false
    let val = ''

    if (isObject(data)) {
      for( let key in data ) {
        if (data.hasOwnProperty(key)) {
          val += `&${key}=${data[key]}`
        }
      }
    } else {
      val = data
    }

    script.style.display = 'none'
    script.src = url + type + 'callback=' + callbackName + val

    window[callbackName] = (result:any) => {
      timeoutFlag = true
      resolve(result)
      window[callbackName] = undefined
    }

    script.onerror = function (e) {
      timeoutFlag = true
      reject(e)
      window[callbackName] && (window[callbackName] = undefined)
    }

    setTimeout(() => {
      if (timeoutFlag) return
      window[callbackName] = () => window[callbackName] = undefined

      logError('Net', 'request timed out', true)
    }, timeout)

    document.head.appendChild(script)
    document.head.removeChild(script)
  })
}