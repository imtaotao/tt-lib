import { platform } from './utils'

function initRequsetAnimation () {
  window.requestAnimationFrame =
  (<any>window).requestAnimationFrame      ||
  (<any>window).webkitRequestAnimationFrame||
  (<any>window).mozRequestAnimationFrame   ||
  (<any>window).oRequestAnimationFrame     ||
  (<any>window).msRequestAnimationFrame	   ||
  function (callback) {
    return window.setTimeout(callback, 1000 / 60)
  }

  window.cancelAnimationFrame =
  (<any>window).cancelAnimationFrame 	     ||
  (<any>window).webkitCancelAnimationFrame ||
  (<any>window).mozCancelAnimationFrame	   ||
  (<any>window).oCancelAnimationFrame      ||
  (<any>window).msCancelAnimationFrame     ||
  clearTimeout
}

export function initEnv () {
  if (platform.browser || platform.electron) {
    initRequsetAnimation()
  }
}
