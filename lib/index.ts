import { initEnv } from './init_env'
import * as buffer from './buffer_utils'
import * as utils from './utils'
import { Slide } from './canvas_banner'
import { Record } from './record_audio'

initEnv()
export default {
  buffer,
  utils,
  Slide,
  Record,
}