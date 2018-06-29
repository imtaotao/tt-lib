export type endTypes = (...args:any[]) => void

export type UnitFun<T> = (next:UnitFun<T>, ...args:T[]) => void

export type RejisterFun<A> = (next:UnitFun<any>, ...args:A[]) => void

export type QueueEndHook = (args: any[]) => void

export interface QueueTypes {
  fx: UnitFun<any>[]
  end: endTypes
  register<T> (fun:RejisterFun<T>) : Queue
  remove (start:number, end?:number) : Queue
}


export class Queue implements QueueTypes {
  public fx:UnitFun<any>[]
  public end:endTypes
  private lock:boolean
  private isInitEmit:boolean

  constructor () {
    this.fx = []
    this.lock = false
    this.isInitEmit = true
    this.end = () => {}
  }

  public register<A> (fun:RejisterFun<A>) : Queue {
    const { fx, isInitEmit } = this
    const queue_fun:UnitFun<any> = (next, ...args) => {
	    fun(next, ...args)
    }

    fx.push(queue_fun)

    if (isInitEmit) {
      this.lock = false
      this.isInitEmit = false
      this.emit()
    }

    return this
  }

  private emit (...args:any[]) : Queue {
    const { fx, lock } = this
    if (lock) { return this }

    if (!fx.length) {
      this.end(...args)
      this.isInitEmit = true
      return this
    }

    const currentFunc = fx.shift()

    if (currentFunc) {
      this.lock = true

      currentFunc((...params) => {
        this.lock = false
        this.emit(...params)
      }, ...args)
    }

    return this
  }

  public remove (start:number, end = 1) : Queue {
    this.fx.splice(start, end)

    return this
  }
}