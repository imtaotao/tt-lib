import { logError } from './utils'

export class CanvasBanner {
  private index = 0
  private animate:Banner[]
  private totalImg:HTMLImageElement[]
  private randomStr:string
  private toggle =  false
  private imgArr:string[]
  private defaultUrl:string
  private option: {
    dom:HTMLElement
    time:number
    swap?:boolean
    mode?:'circle' | 'rect'
    mount?:number,
    speed?:number,
    defaultUrl?:string,
  }

  public constructor (option:CanvasBanner['option'], imgArr:string[]) {
    if (!option.dom) {
      logError('Canvas banner', 'DOM element must exist ', true)
    }
    if (!imgArr || imgArr.length < 2) {
      logError('Canvas banner', 'Img array length must be greater than 2', true)
    }
    this.imgArr = imgArr
    this.option = option
    this.totalImg = []
    this.animate = []
    this.defaultUrl = option.defaultUrl || imgArr[1]
    option.mount = option.mount || 5
    option.mode	= option.mode	|| 'circle'

    this.createImgDOM()
    .then(() => this.defaultImg(() => this.move()))
  }

  // 利用闭包为每次的动画增加一个随机戳
  private transition (randomStr:string) {
    return (img:HTMLImageElement) => {
      if (!img) return
      const { animate, imgArr } = this
      const { dom, mount, swap, speed } = this.option

      // 选择模式
      if (swap) {
        this.toggle = !this.toggle
        this.option.mode = this.toggle
          ? 'circle'
          : 'rect'
      }

      // 根据模式选择不同的时间
      const mode:any = this.option.mode
      const time = this.option.time || 0
      const t = mode === 'circle' ? 0 : 150

      this.removeCanvas(dom, animate[animate.length - 1])
      .then(() => {
        this.animate = []
        const endFun = (dom:HTMLElement) => {
          this.index++
          if (this.index > imgArr.length - 1) this.index = 0
          if (this.over() === false) return

          setTimeout(() => {
            if (randomStr !== this.randomStr || (<any>!this.middleware).isanimate) return
            this.move()
          }, time)
        }

        for (let i = 0; i < <number>mount; i++) {
          setTimeout(() => {
            if (randomStr !== this.randomStr) return

            const option = {
              img,
              mode,
              mount: <number>mount,
              speed: <number>speed,
              index: i + 1,
            }

            const banner = i === <number>mount - 1
              ? new Banner(dom, option, this.middleware, endFun)
              : new Banner(dom, option, this.middleware)

            this.animate.push(banner)
          }, t * i)
        }
      })
    }
  }

  public stop () {
    (<any>this.middleware).isanimate = false
    this.animate.forEach(val => cancelAnimationFrame(this.getAnimete(val)))
  }

  private defaultImg (callback:Function) {
    const url = this.defaultUrl
    const img = this.createImg(url)
    const canvas = CanvasBanner.createCanvas(this.option.dom)
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight)
      callback && callback()
    }
  }

  private createImgDOM () {
    return new Promise ((resolve, reject) => {
      const imgArr = this.imgArr
      const single = 100
      const all = single * imgArr.length
      let progress = 0

      imgArr.forEach(url => {
        const img = this.createImg(url)
        this.totalImg.push(img)
        img.onload = () => {
          progress += single
          progress === all && resolve()
        }
      })
    })
  }

   private move () {
    if (this.totalImg.length === 0 || this.start() === false) return
    (<any>this.middleware).isanimate = true
    const randomStr = this.randomStr
                    = (<any>this.middleware).randomStr
                    = CanvasBanner.random(9999999) + CanvasBanner.random(9999999).toString(32)
    this.transition(randomStr)(this.totalImg[this.index])
  }

  // 继续
  public continue () {
    if (this.animate.length === 0) return

    (<any>this.middleware).isanimate = true
    const mode = this.option.mode

    this.animate.forEach(val => {
      val[`${mode}Move`]()
    })
  }

  // 上一张
  public preImg () {
    this.stop()
    this.index--
    if (this.index < 0) this.index = this.totalImg.length - 1
    this.move()
  }

  // 下一张
  public nextImg () {
    this.stop()
    this.index++
    if (this.index > this.totalImg.length - 1) this.index = 0
    this.move()
  }

  public getIndex () {
    return this.index
  }

  public specify (num) {
    if (num > this.totalImg.length - 1 || num < 0) {
      logError('Canvas banner', 'The specified index is incorrect', false, true)
    }
    this.stop()
    this.index = num
    this.move()
  }

  // 每次动画开始和完成后的钩子，return  false 可以终止动画
  public start () : boolean { return true }
  public over () : boolean { return true }


  // 工具方法
  private createImg (url) {
    const img = new Image
    img.src   = url
    return img
  }

  static
  random (max) {
    return parseInt(Math.random() * (max + 1) as any)
  }

  static
  createCanvas (dom) {
    const canvas = document.createElement('canvas')
    dom.appendChild(canvas)
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    canvas.style.position = 'absolute'
    return canvas
  }

  private getAnimete (banner) {
    return banner.requestAnimationFrame
  }

  private removeCanvas (dom, banner) {
    return new Promise ((resolve, reject) => {
      const canvas = dom.querySelectorAll('canvas')
      canvas.forEach((val, i) => {
        i < canvas.length - 1 && dom.removeChild(val)
      })
      if (banner) {
        const {img, width, height, ctx} = banner.option
        ctx.drawImage(img, 0, 0, width, height)
      }

      resolve()
    })
  }

  // 不能定义属性，用方法过度
  private middleware () {}
}


class Banner {
  private dom:HTMLElement
  private callback:Function
  private ctx:CanvasRenderingContext2D
  private requestAnimationFrame:any
  private middleware:Function
  private option: {
    img:HTMLImageElement
    mode:'circle' | 'rect'
    mount:number
    speed:number
    index:number
    width?:number
    height?:number
    direct?:number
    ctx?:CanvasRenderingContext2D
    x?:number
    y?:number
    singleBar?:number
    raduis?:number
    add?:number
  }

  public constructor (dom:HTMLElement, option:Banner['option'], middleware:Function, callback?:Function) {
    if (!option || typeof option !== 'object' || !option.img) return
    const canvas = CanvasBanner.createCanvas(dom)
    const width = option.width  = canvas.offsetWidth
    const height = option.height = canvas.offsetHeight
    option.direct = width > height ? width : height
    option.speed = option.speed || option.direct / 200

    this.dom = dom
    this.middleware = middleware
    this.callback = callback || (() => {})
    this.ctx = option.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.option = option
    this.requestAnimationFrame = null
    this.init()
  }

  private init () {
    const { width, height, ctx, mode, img } = <any>this.option
    ctx.drawImage(img, 0, 0, width, height)
    this[`${mode}Draw`]()
    this.position()
  }

  private position () {
    const { width, height, mode, mount, index, direct } = <any>this.option
    if (mode === 'circle') {
      this.option.x = CanvasBanner.random(width)
      this.option.y = CanvasBanner.random(height)
      this.option.raduis = 0
    }
    if (mode === 'rect') {
      const singleBar = this.option.singleBar = direct / mount
      this.option.x = singleBar * (index - 1)
      this.option.add = 0
    }
  }

  // 绘制圆形
  private circleDraw () {
    const { width, height, ctx, img, x, y, raduis } = <any>this.option

    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, raduis, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, width, height)
    ctx.restore()
    this.circleMove()
  }

  private circleMove () {
    let isanimate = (<any>this.middleware).isanimate
    let { raduis, direct, speed } = <any>this.option
    this.requestAnimationFrame = requestAnimationFrame(_ => {
      if (!isanimate) return
      const distance = direct / 400
      if (raduis > direct / (distance > 1 ? distance : 1)) {
        !!this.callback && this.callback(this.dom)
        return
      }

      (<number>this.option.raduis) += speed / 2
      this.circleDraw()
    })
  }

  // 绘制方形
  private rectDraw () {
    const { width, height, ctx, img, x, add, singleBar } = <any>this.option

    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.beginPath()
    ctx.rect(x, 0, singleBar, add)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, width, height)
    ctx.restore()
    this.rectMove()
  }

  private rectMove () {
    let {add, height, speed} = <any>this.option
    let isanimate = (<any>this.middleware).isanimate

    this.requestAnimationFrame = requestAnimationFrame(_ => {
      if (!isanimate) return
      if (add > height) {
        !!this.callback && this.callback(this.dom)
        return
      }
      this.option.add += speed
      this.rectDraw()
    })
  }
}