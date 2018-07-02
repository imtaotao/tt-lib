import * as Buffer from './buffer_utils'
import * as Utils from './utils'
import * as NodeUtils from './node_utils'
import * as Matrix from './matrix'
import * as Net from './net'
import { Event } from './events'
import { Slide } from './canvas_banner'
import { Record } from './record_audio'
import { Queue } from './queue'
import e from 'audiobuffer-arraybuffer-serializer'

export default {
  AudioContext: new AudioContext(),
  NodeUtils,
  Matrix,
  Buffer,
  Utils,
  Slide,
  Record,
  Queue,
  Event,
  Net,
  e,
}