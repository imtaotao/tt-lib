/// <reference types="node" />
export declare function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer;
export declare function arrayBufferToBuffer(arraybuffer: ArrayBuffer): Buffer;
export declare function audioBufferToArrayBuffer(audioBuffer: AudioBuffer, channel?: number): ArrayBuffer;
export declare function arrayBufferToAcResource(ac: AudioContext, arraybuffer: ArrayBuffer, volume?: number): Promise<AudioBufferSourceNode>;
export declare function mergeArraybuffer(buffers: ArrayBuffer[]): ArrayBuffer;
export declare function mergeAduioBuffer(ac: AudioContext, buffers: AudioBuffer[]): AudioBuffer;
