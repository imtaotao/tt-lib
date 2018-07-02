export declare class Slide {
    private index;
    private animate;
    private totalImg;
    private randomStr;
    private toggle;
    private imgArr;
    private defaultUrl;
    private option;
    constructor(option: Slide['option'], imgArr: string[]);
    private transition;
    stop(): void;
    private defaultImg;
    private createImgDOM;
    private move;
    continue(): void;
    preImg(): void;
    nextImg(): void;
    getIndex(): number;
    specify(num: any): void;
    start(): boolean;
    over(): boolean;
    private createImg;
    static random(max: any): number;
    static createCanvas(dom: any): HTMLCanvasElement;
    private getAnimete;
    private removeCanvas;
    private middleware;
}
