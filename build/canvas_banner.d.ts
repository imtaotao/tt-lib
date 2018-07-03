export declare class CanvasBanner {
    private index;
    private animate;
    private totalImg;
    private randomStr;
    private toggle;
    private imgArr;
    private defaultUrl;
    private option;
    constructor(option: CanvasBanner['option'], imgArr: string[]);
    private transition(randomStr);
    stop(): void;
    private defaultImg(callback);
    private createImgDOM();
    private move();
    continue(): void;
    preImg(): void;
    nextImg(): void;
    getIndex(): number;
    specify(num: any): void;
    start(): boolean;
    over(): boolean;
    private createImg(url);
    static random(max: any): number;
    static createCanvas(dom: any): HTMLCanvasElement;
    private getAnimete(banner);
    private removeCanvas(dom, banner);
    private middleware();
}
