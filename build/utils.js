export var AudioCtx = new AudioContext();
export var platform = (function () {
    var browser = typeof window;
    var node = typeof global;
    var electron = browser && node;
    return {
        browser: browser,
        node: node,
        electron: electron,
    };
})();
export function logError(tipHead, infor, err, warn) {
    if (err === void 0) { err = false; }
    if (warn === void 0) { warn = false; }
    var msg = "[" + tipHead + " tip] --> " + infor + ".\n";
    if (err)
        throw Error(msg);
    if (warn)
        return console.warn(msg);
    console.error(msg);
}
export function download(url, filename) {
    if (!isString(url)) {
        url = window.URL.createObjectURL(url);
    }
    var link = window.document.createElement('a');
    link.href = url;
    link.download = filename || 'download.wav';
    var click = document.createEvent('MouseEvents');
    click.initMouseEvent('click', true, true);
    link.dispatchEvent(click);
}
export function inlineWorker(func) {
    if (!window.Worker) {
        this.errorFn('Worker is undefined', true);
    }
    var functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
    var url = window.URL.createObjectURL(new window.Blob([functionBody], {
        type: 'text/javascript',
    }));
    return new window.Worker(url);
}
export function isString(string) {
    return Object.prototype.toString.call(string) === '[object String]';
}
export function isNumber(number) {
    return !Number.isNaN(number) && Object.prototype.toString.call(number) === '[object Number]';
}
export function isObject(object) {
    return Object.prototype.toString.call(object) === '[object Object]';
}
export function isFunction(func) {
    return Object.prototype.toString.call(func) === '[object Function]';
}
export function isClass(classBody) {
    return !isString(classBody) && String(classBody).slice(0, 5) === 'class';
}
export function isUndef(val) {
    return val === undefined || val === null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLElBQU0sUUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7QUFFMUMsTUFBTSxDQUFDLElBQU0sUUFBUSxHQUFHLENBQUM7SUFDdkIsSUFBTSxPQUFPLEdBQUcsT0FBTyxNQUFNLENBQUE7SUFDN0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxNQUFNLENBQUE7SUFDMUIsSUFBTSxRQUFRLEdBQUcsT0FBTyxJQUFJLElBQUksQ0FBQTtJQUVoQyxNQUFNLENBQUM7UUFDTCxPQUFPLFNBQUE7UUFDUCxJQUFJLE1BQUE7UUFDSixRQUFRLFVBQUE7S0FDVCxDQUFBO0FBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtBQUVKLE1BQU0sbUJBQW9CLE9BQWMsRUFBRSxLQUFZLEVBQUUsR0FBVyxFQUFFLElBQVk7SUFBekIsb0JBQUEsRUFBQSxXQUFXO0lBQUUscUJBQUEsRUFBQSxZQUFZO0lBQy9FLElBQU0sR0FBRyxHQUFHLE1BQUksT0FBTyxrQkFBYSxLQUFLLFFBQUssQ0FBQTtJQUM5QyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNsQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3BCLENBQUM7QUFFRCxNQUFNLG1CQUFvQixHQUFpQixFQUFFLFFBQVE7SUFDbkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN2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