/// <reference types="node" />
export declare const Buffer: any;
export declare function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer;
export declare function arrayBufferToBuffer(arraybuffer: ArrayBuffer): Buffer;
export declare function arrayBufferToAudioBuffer(arraybuffer: ArrayBuffer): Promise<AudioBuffer>;
export declare function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
export declare function blobToAudioBuffer(blob: Blob): Promise<AudioBuffer>;
export declare function arrayBufferToBlob(arraybuffer: ArrayBuffer, mimeType: string): Blob;
export declare function audioBufferToArrayBuffer(audioBuffer: AudioBuffer): ArrayBuffer;
export declare function arrayBufferToAcResource(ac: AudioContext, arraybuffer: ArrayBuffer, volume?: number): Promise<AudioBufferSourceNode>;
export declare function mergeArraybuffer(buffers: ArrayBuffer[]): ArrayBuffer;
export declare function mergeAduioBuffer(buffers: AudioBuffer[]): AudioBuffer;
export declare function cloneBuffer(buffer: Buffer, isDeep?: boolean): Buffer;
export declare function cloneArrayBuffer(arrayBuffer: ArrayBuffer): ArrayBuffer;
export declare function cloneDataView(dataView: DataView, isDeep?: boolean): DataView;
