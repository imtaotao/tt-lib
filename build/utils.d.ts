export declare const AudioCtx: AudioContext;
export declare const platform: {
    browser: "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function";
    node: "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function";
    electron: "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function";
};
export declare function logError(tipHead: string, infor: string, err?: boolean, warn?: boolean): void;
export declare function download(url: Blob | string, filename: any): void;
export declare function inlineWorker(func: any): any;
export declare function isString(string: any): boolean;
export declare function isNumber(number: any): boolean;
export declare function isObject(object: any): boolean;
export declare function isFunction(func: any): boolean;
export declare function isClass(classBody: any): boolean;
export declare function isUndef(val: any): boolean;
