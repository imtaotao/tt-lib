import * as Buffer from './buffer_utils'
import * as Utils from './utils'
import * as NodeUtils from './node_utils'
import * as Matrix from './matrix'
import * as Net from './net'
import * as FP from './functional_paradigm'
import { Event } from './events'
import { CanvasBanner } from './canvas_banner'
import { Record } from './record_audio'
import { Queue } from './queue'

export default {
  AudioContext: new AudioContext(),
  CanvasBanner,
  NodeUtils,
  Matrix,
  Buffer,
  Record,
  Utils,
  Queue,
  Event,
  Net,
  FP,
  e: null,
}