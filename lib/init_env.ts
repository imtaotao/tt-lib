import { platform } from './utils'

declare const window:any

function initBrowserAndElectron () {
  window.requestAnimationFrame =
  window.requestAnimationFrame      ||
  window.webkitRequestAnimationFrame||
  window.mozRequestAnimationFrame   ||
  window.oRequestAnimationFrame     ||
  window.msRequestAnimationFrame	  ||
  function (callback) {
    return window.setTimeout(callback, 1000 / 60)
  }

  window.cancelAnimationFrame =
  window.cancelAnimationFrame 	     ||
  window.webkitCancelAnimationFrame  ||
  window.mozCancelAnimationFrame	   ||
  window.oCancelAnimationFrame       ||
  window.msCancelAnimationFrame      ||
  clearTimeout

  window.AudioContext =
  window.AudioContext       ||
  window.webkitAudioContext ||
  window.mozAudioContext    ||
  window.msAudioContext
}

export function initEnv () {
  if (platform.browser || platform.electron || platform.webpack) {
    initBrowserAndElectron()
  }
}
