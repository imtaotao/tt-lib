import { initEnv } from './init_env';
import * as Buffer from './buffer_utils';
import * as Utils from './utils';
import * as NodeUtils from './node_utils';
import { Event } from './events';
import { Slide } from './canvas_banner';
import { Record } from './record_audio';
import { Queue } from './queue';
initEnv();
export default {
    AudioContext: new AudioContext(),
    NodeUtils: NodeUtils,
    Buffer: Buffer,
    Utils: Utils,
    Slide: Slide,
    Record: Record,
    Queue: Queue,
    Event: Event,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUNwQyxPQUFPLEtBQUssTUFBTSxNQUFNLGdCQUFnQixDQUFBO0FBQ3hDLE9BQU8sS0FBSyxLQUFLLE1BQU0sU0FBUyxDQUFBO0FBQ2hDLE9BQU8sS0FBSyxTQUFTLE1BQU0sY0FBYyxDQUFBO0FBQ3pDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUE7QUFDaEMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQ3ZDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUN2QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBRS9CLE9BQU8sRUFBRSxDQUFBO0FBRVQsZUFBZTtJQUNiLFlBQVksRUFBRSxJQUFJLFlBQVksRUFBRTtJQUNoQyxTQUFTLFdBQUE7SUFDVCxNQUFNLFFBQUE7SUFDTixLQUFLLE9BQUE7SUFDTCxLQUFLLE9BQUE7SUFDTCxNQUFNLFFBQUE7SUFDTixLQUFLLE9BQUE7SUFDTCxLQUFLLE9BQUE7Q0FDTixDQUFBIn0=