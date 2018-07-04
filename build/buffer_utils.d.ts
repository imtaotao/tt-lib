/// <reference types="node" />
export declare const Buffer: any;
export declare function bufferToArraybuffer(buffer: Buffer): ArrayBuffer;
export declare function arraybufferToBuffer(arraybuffer: ArrayBuffer): Buffer;
export declare function arraybufferToAudiobuffer(arraybuffer: ArrayBuffer): Promise<AudioBuffer>;
export declare function blobToArraybuffer(blob: Blob): Promise<ArrayBuffer>;
export declare function blobToAudiobuffer(blob: Blob): Promise<AudioBuffer>;
export declare function arraybufferToBlob(arraybuffer: ArrayBuffer, mimeType: string): Blob;
export declare function audiobufferToArraybuffer(audioBuffer: AudioBuffer): ArrayBuffer;
export declare function arraybufferToAcResource(ac: AudioContext, arraybuffer: ArrayBuffer, volume?: number): Promise<AudioBufferSourceNode>;
export declare function mergeArraybuffer(buffers: ArrayBuffer[]): ArrayBuffer;
export declare function mergeAduiobuffer(buffers: AudioBuffer[]): AudioBuffer;
export declare function cloneBuffer(buffer: Buffer, isDeep?: boolean): Buffer;
export declare function cloneArraybuffer(arrayBuffer: ArrayBuffer): ArrayBuffer;
export declare function cloneDataView(dataView: DataView, isDeep?: boolean): DataView;
