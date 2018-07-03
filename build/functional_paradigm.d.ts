export declare function curry(fun: Function): Function;
export declare function compose(...funArgs: Function[]): Function;
export declare function prop(key: any): Function;
export declare class Container {
    private _value;
    constructor(x: any);
    map(fun: Function): Container;
    isUndef(): boolean;
    maybeMap(fun: Function): Container;
    static of(x: any): Container;
    static maybe(val: any, fun: Function): any;
}
