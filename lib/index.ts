import { initEnv } from './init_env'
import * as Buffer from './buffer_utils'
import * as Utils from './utils'
import * as NodeUtils from './node_utils'
import { Event } from './events'
import { Slide } from './canvas_banner'
import { Record } from './record_audio'
import { Queue } from './queue'

initEnv()

export default {
  AudioContext: new AudioContext(),
  NodeUtils,
  Buffer,
  Utils,
  Slide,
  Record,
  Queue,
  Event,
}