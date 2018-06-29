import * as Buffer from './buffer_utils';
import * as Utils from './utils';
import * as NodeUtils from './node_utils';
import { Event } from './events';
import { Slide } from './canvas_banner';
import { Record } from './record_audio';
import { Queue } from './queue';
declare const _default: {
    AudioContext: AudioContext;
    NodeUtils: typeof NodeUtils;
    Buffer: typeof Buffer;
    Utils: typeof Utils;
    Slide: typeof Slide;
    Record: typeof Record;
    Queue: typeof Queue;
    Event: typeof Event;
};
export default _default;
