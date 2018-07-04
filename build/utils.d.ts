export * from './response_data';
export declare const platform: {
    browser: boolean;
    node: boolean;
    electron: boolean;
    build: boolean;
};
export declare const AudioCtx: AudioContext;
export declare function require(nodeModule: any): any;
export declare function getClassOf(val: any): string;
export declare function isString(string: any): boolean;
export declare function isNumber(number: any): boolean;
export declare function isBoolean(boolean: any): boolean;
export declare function isObject(object: any): boolean;
export declare function isFunction(func: any): boolean;
export declare function isClass(classBody: any): boolean;
export declare function isUndef(val: any): boolean;
export declare function isElement(element: any): boolean;
export declare function logError(tipHead: string, infor: string, err?: boolean, warn?: boolean): void;
export declare function download(url: Blob | string, filename: any): void;
export declare function inlineWorker(func: any): Worker;
export declare function normalNumber(val: number, max: number, min: number): number;
export declare function random(max?: number, min?: number, fractionDigits?: number): number;
export declare function randomString(range?: number): string;
export declare function hexToRgb(hex: string, noCheck?: boolean): number[];
export declare function rgbToHex(rgb: string, noCheck?: boolean): string;
export declare function aop(originFun: Function, beforeFun: Function | null, afterFun?: Function): Function;
export declare function bind(fun: Function, ctx: Object): Function;
export declare function isEmptyObj(obj: Object): boolean;
export declare function toFastProperties(obj: Object): Object | never;
