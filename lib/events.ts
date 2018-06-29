import { isString, isFunction, logError } from './utils'

class EventQueue {
  private type:string
  private commonFuns:Function[]
  private onceFuns:Function[]
  public constructor (type:string) {
    this.type = type
    this.commonFuns = []
    this.onceFuns = []
  }

  public on (func:Function) {
    if (!isFunction(func)) logError('Event', `[ registered callback function ] is not a function`, true)

    this.commonFuns.push(func)
  }

  public once (func:Function) {
    if (!isFunction(func)) logError('Event', `[ registered callback function ] is not a function`, true)

    this.onceFuns.push(func)
  }

  public emit (data?:any) {
    const { commonFuns, onceFuns } = this
    const event = { data, type: this.type }

    for (const fun of commonFuns) {
      fun(event)
    }

    for (let i = 0; i < onceFuns.length; i++) {
      onceFuns[i](event)
      onceFuns.splice(i, 1)
      i--
    }
  }

  public emitCommon (data?:any) {
    const commonFuns = this.commonFuns

    for (const fun of commonFuns) {
      fun({
        type: this.type,
        data,
      })
    }
  }

  public emitOnce (data?:any) {
    const onceFuns = this.onceFuns

    for (let i = 0; i < onceFuns.length; i++) {
      onceFuns[i]({
        type: this.type,
        data,
      })
      onceFuns.splice(i, 1)
      i--
    }
  }

  public remove (func?:Function, keyWord?:'common' | 'once') {
    if (!func) {
      this.commonFuns = []
      this.onceFuns = []
      return
    }

    if (!isFunction(func)) logError('Event', `[ ${func} ] is not a function`, true)
    if (keyWord && keyWord !== 'common' && keyWord !== 'once') {
      logError('Event', `[ keyWord ] must be a "common" or "once", But now is ${keyWord}`, true)
    }

    const { commonFuns, onceFuns } = this

    if (!keyWord || keyWord === 'common') {
      for (let i = 0; i < commonFuns.length; i++) {
        if (commonFuns[i] === func) {
          commonFuns.splice(i, 1)
          i--
        }
      }
    }

    if (!keyWord || keyWord === 'once') {
      for (let i = 0; i < onceFuns.length; i++) {
        if (onceFuns[i] === func) {
          onceFuns.splice(i, 1)
          i--
        }
      }
    }
  }

  public removeCommon () {
    this.commonFuns = []
  }

  public removeOnce () {
    this.onceFuns = []
  }
}

export class Event {
  public constructor () {}

  public create (type:string) : Event {
    if (!isString(type)) logError('Event', `[ event name ] is not a string`, true)
    if (this[type]) logError('Event', 'The current queue already exists. Please do not create it again')

    this[type] = new EventQueue(type)

    return this
  }
}