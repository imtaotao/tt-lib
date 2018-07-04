function initBrowserAndElectron() {
    window.requestAnimationFrame =
        window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
    window.cancelAnimationFrame =
        window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            clearTimeout;
    window.AudioContext =
        window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.msAudioContext;
}
function initEnv() {
    if (platform.browser || platform.electron || platform.build) {
        initBrowserAndElectron();
    }
}

var ResponseData = (function () {
    function ResponseData(data, responseCallback) {
        if (!isObject(data) && !Array.isArray(data)) {
            logError('Response data', "[ response data ] must be a \"object\" or \"array\", but now is a \"" + typeof data + "\"", true);
        }
        this.originData = data;
        this.responseCallback = responseCallback || (function () { });
        this.rewrite = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
        this.observe(data);
    }
    ResponseData.prototype.observe = function (obj, path) {
        var _this = this;
        if (Array.isArray(obj)) {
            this.definedArrayProto(obj, path);
        }
        var _loop_1 = function (key) {
            if (!obj.hasOwnProperty(key))
                return "continue";
            var oldVal = obj[key];
            var pathArr = path && path.slice(0);
            pathArr
                ? pathArr.push(key)
                : pathArr = [key];
            Object.defineProperty(obj, key, {
                set: function (newVal) {
                    if (newVal === oldVal)
                        return;
                    if (isObject(newVal) || Array.isArray(newVal)) {
                        _this.observe(newVal, pathArr);
                    }
                    _this.responseCallback(newVal, oldVal, _this.join(pathArr));
                    oldVal = newVal;
                },
                get: function () { return oldVal; }
            });
            if (isObject(oldVal) || Array.isArray(oldVal)) {
                this_1.observe(oldVal, pathArr);
            }
        };
        var this_1 = this;
        for (var key in obj) {
            _loop_1(key);
        }
    };
    ResponseData.prototype.definedArrayProto = function (array, path) {
        var _self = this;
        var originProto = Array.prototype;
        var definedProto = Object.create(originProto);
        var _loop_2 = function (i) {
            var methodName = this_2.rewrite[i];
            Object.defineProperty(definedProto, methodName, {
                value: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var oldArray = this.slice(0);
                    var result = originProto[methodName].apply(this, args);
                    _self.observe(this, path);
                    _self.responseCallback(this, oldArray, null, methodName);
                    return result;
                },
                writable: true,
                enumerable: false,
                configurable: true,
            });
        };
        var this_2 = this;
        for (var i = 0; i < this.rewrite.length; i++) {
            _loop_2(i);
        }
        Object.setPrototypeOf(array, definedProto);
    };
    ResponseData.prototype.join = function (array) {
        return "['" + array.join("']['") + "']";
    };
    return ResponseData;
}());
function createResponseData$$1(data, responseCallback) {
    new ResponseData(data, responseCallback);
}

var platform = (function () {
    var _this = (0, eval)('this');
    var haveGlobal = typeof global === 'object';
    var haveBrowserWindow = !!_this && typeof _this.window === 'object';
    var browser = haveBrowserWindow && !haveGlobal;
    var node = !browser && haveGlobal && global.constructor.name === 'Object';
    var build = !haveBrowserWindow && haveGlobal && global.constructor.name === 'Window';
    var electron = haveBrowserWindow && haveGlobal && global.constructor.name === 'Window';
    return {
        browser: browser,
        node: node,
        electron: electron,
        build: build,
    };
})();
initEnv();
var AudioCtx = new AudioContext();
function require(nodeModule) {
    return require(nodeModule);
}
function getClassStr(val) {
    return Object.prototype.toString.call(val);
}
function isString(string) {
    return getClassStr(string) === '[object String]';
}
function isNumber(number) {
    return !Number.isNaN(number) && getClassStr(number) === '[object Number]';
}
function isBoolean(boolean) {
    return getClassStr(boolean) === '[object Boolean]';
}
function isObject(object) {
    return getClassStr(object) === '[object Object]';
}
function isFunction(func) {
    var tag = getClassStr(func);
    return tag === '[object Function]' || tag === '[object AsyncFunction]' || tag === '[object GeneratorFunction]' || tag === '[object Proxy]';
}
function isClass(classBody) {
    return !isString(classBody) && String(classBody).slice(0, 5) === 'class';
}
function isUndef(val) {
    return val === undefined || val === null;
}
function isElement(element) {
    return !!(element.nodeType && element !== document && element.nodeType === 1 && element.tagName);
}
function logError(tipHead, infor, err, warn) {
    if (err === void 0) { err = false; }
    if (warn === void 0) { warn = false; }
    var msg = "[" + tipHead + " tip] --> " + infor + ".\n";
    if (err)
        throw Error(msg);
    if (warn)
        return console.warn(msg);
    console.error(msg);
}
function download(url, filename) {
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
function inlineWorker(func) {
    if (!window.Worker) {
        this.errorFn('Worker is undefined', true);
    }
    var functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
    var url = window.URL.createObjectURL(new window.Blob([functionBody], {
        type: 'text/javascript',
    }));
    return new window.Worker(url);
}
function normalNumber(val, max, min) {
    return Math.max(Math.min(val, max), min);
}
function random(max, min, fractionDigits) {
    if (max === void 0) { max = 100000; }
    if (min === void 0) { min = 0; }
    if (fractionDigits === void 0) { fractionDigits = 0; }
    return +(Math.random() * (max - min) + min).toFixed(fractionDigits);
}
function randomString(range) {
    if (range === void 0) { range = 16; }
    var chartStr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIGKMLNOPQRSTUVWSYZ_!~@#$%^&*()+=-><,.?/';
    var string = '';
    for (var i = 0; i < range; i++) {
        string += chartStr[parseInt((Math.random() * chartStr.length))];
    }
    return string;
}
function hexToRgb(hex, noCheck) {
    if (!noCheck && !isString(hex)) {
        logError('Utils', "[ hex ] must be a \"string\", but now is " + typeof hex, true);
    }
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/;
    var color = hex.toLowerCase();
    if (!noCheck && (!color || !reg.test(color))) {
        logError('Utils', '[ hex ] does not meet the requirements', true);
    }
    if (color.length === 4) {
        var newColorStr = '#';
        for (var i = 1; i < 4; i++) {
            var s = color.slice(i, i + 1);
            newColorStr += s.concat(s);
        }
        color = newColorStr;
    }
    var colorArr = [];
    for (var j = 1; j < 7; j += 2) {
        colorArr.push(+('0x' + color.slice(j, j + 2)));
    }
    if (color.length === 9) {
        var opacity = +('0x' + color.slice(7, 9)) / 255;
        colorArr.push(opacity.toFixed(1));
    }
    return colorArr;
}
function rgbToHex(rgb, noCheck) {
    if (!noCheck && !isString(rgb)) {
        logError('Utils', "[ rgb(a) ] must be a \"string\", but now is " + typeof rgb, true);
    }
    if (!noCheck && !/^(rgb(a?)|RGB(A?))/.test(rgb)) {
        logError('Utils', '[ rgb(a) ] does not meet the requirements', true);
    }
    var rgbArr = rgb.replace(/(?:\(|\)|rgb(a?)|RGB(A?))*/g, '').split(',');
    var hexStr = '#';
    if (rgbArr.length === 4) {
        rgbArr.push(Math.round(rgbArr.splice(3, 1)[0] * 255));
    }
    for (var i = 0; i < rgbArr.length; i++) {
        var hex = Number(rgbArr[i]).toString(16);
        if (hex.length < 2) {
            hex = '0' + hex;
        }
        hexStr += hex;
    }
    return hexStr;
}
function aop(originFun, beforeFun, afterFun) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (beforeFun && beforeFun.apply(this, args) === false)
            return;
        var result = originFun.apply(this, args);
        afterFun && afterFun.call.apply(afterFun, [this].concat(args, [result]));
        return result;
    };
}
function bind(fun, ctx) {
    function bound_fun(a) {
        var l = arguments.length;
        return l
            ? l > 1
                ? fun.apply(ctx, arguments)
                : fun.call(ctx, a)
            : fun.call(ctx);
    }
    bound_fun._length = fun.length;
    return bound_fun;
}
function isEmptyObj(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
function toFastProperties(obj) {
    return obj;
}

var Utils = /*#__PURE__*/Object.freeze({
    platform: platform,
    AudioCtx: AudioCtx,
    require: require,
    getClassStr: getClassStr,
    isString: isString,
    isNumber: isNumber,
    isBoolean: isBoolean,
    isObject: isObject,
    isFunction: isFunction,
    isClass: isClass,
    isUndef: isUndef,
    isElement: isElement,
    logError: logError,
    download: download,
    inlineWorker: inlineWorker,
    normalNumber: normalNumber,
    random: random,
    randomString: randomString,
    hexToRgb: hexToRgb,
    rgbToHex: rgbToHex,
    aop: aop,
    bind: bind,
    isEmptyObj: isEmptyObj,
    toFastProperties: toFastProperties,
    createResponseData: createResponseData$$1
});

function bufferToArrayBuffer(buffer) {
    var arraybuffer = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(arraybuffer);
    for (var i = 0; i < view.length; i++) {
        view[i] = buffer[i];
    }
    return arraybuffer;
}
function arrayBufferToBuffer(arraybuffer) {
    if (platform.browser || platform.build) {
        logError('Buffer utils', '[ arrayBufferToBuffer ] method Must be used in "node" or "electron"', true);
    }
    var buffer = new Buffer(arraybuffer.byteLength);
    var view = new Uint8Array(arraybuffer);
    for (var i = 0; i < buffer.length; i++) {
        buffer[i] = view[i];
    }
    return buffer;
}
function arrayBufferToAudioBuffer(arraybuffer) {
    var ac = AudioCtx;
    return ac.decodeAudioData(arraybuffer)
        .then(function (audioBuffer) { return audioBuffer; })
        .catch(function (error) { return error; });
}
function blobToArrayBuffer(blob) {
    return new Promise(function (resolve) {
        var reader = new FileReader;
        reader.readAsArrayBuffer(blob);
        reader.onload = function () { return resolve(reader.result); };
    });
}
function blobToAudioBuffer(blob) {
    return new Promise(function (resolve) {
        var ac = AudioCtx;
        var reader = new FileReader;
        reader.readAsArrayBuffer(blob);
        reader.onload = function () {
            ac.decodeAudioData(reader.result, function (ab) { return resolve(ab); });
        };
    });
}
function arrayBufferToBlob(arraybuffer, mimeType) {
    return new Blob([arraybuffer], { type: mimeType });
}
function audioBufferToArrayBuffer(audioBuffer) {
    var channel = audioBuffer.numberOfChannels;
    function collect(buffers) {
        if (buffers.length < 2)
            return buffers[0];
        var length = buffers[0].length + buffers[1].length;
        var result = new Float32Array(length);
        var index = 0;
        var inputIndex = 0;
        while (index < length) {
            result[index++] = buffers[0][inputIndex];
            result[index++] = buffers[1][inputIndex];
            inputIndex++;
        }
        return result;
    }
    function getFloat32Array() {
        var buffers = [];
        for (var i = 0; i < channel; i++) {
            buffers.push(audioBuffer.getChannelData(i));
        }
        return buffers;
    }
    var buffers = getFloat32Array();
    return collect(buffers).buffer;
}
function arrayBufferToAcResource(ac, arraybuffer, volume) {
    if (volume === void 0) { volume = 1; }
    return ac.decodeAudioData(arraybuffer)
        .then(function (audioBuffer) {
        var source = ac.createBufferSource();
        var gainNode = ac.createGain();
        gainNode.connect(ac.destination);
        source.connect(gainNode);
        source.buffer = audioBuffer;
        gainNode.gain.value = volume;
        return source;
    })
        .catch(function (error) { return error; });
}
function mergeArraybuffer(buffers) {
    if (buffers.length === 1)
        return buffers[0];
    return buffers.reduce(function (collectBuffer, buffer, i) {
        var tmp = new Uint8Array(collectBuffer.byteLength + buffer.byteLength);
        tmp.set(new Uint8Array(collectBuffer), 0);
        tmp.set(new Uint8Array(buffer), collectBuffer.byteLength);
        return tmp.buffer;
    }, buffers[0]);
}
function mergeAduioBuffer(buffers) {
    var ac = AudioCtx;
    var channels = 2;
    function getLength() {
        var length = 0;
        for (var i = 0; i < buffers.length; i++) {
            length += buffers[i].length;
        }
        return length;
    }
    function getConcatBuffer(newAudioBuffer) {
        var newBuffers = [];
        for (var i = 0; i < channels; i++) {
            newBuffers[i] = newAudioBuffer.getChannelData(i);
        }
        return newBuffers;
    }
    var frameCount = getLength();
    var audioBuffer = ac.createBuffer(channels, frameCount, ac.sampleRate);
    var newBuffers = getConcatBuffer(audioBuffer);
    for (var i = 0; i < newBuffers.length; i++) {
        var newBuffer = newBuffers[i];
        var size = 0;
        for (var _i = 0, buffers_1 = buffers; _i < buffers_1.length; _i++) {
            var buffer = buffers_1[_i];
            var data = buffer.getChannelData(i);
            for (var j = 0; j < data.length; j++) {
                newBuffer[size++] = data[j];
            }
        }
    }
    return audioBuffer;
}
function cloneBuffer(buffer, isDeep) {
    if (isDeep)
        return buffer.slice();
    var length = buffer.length;
    var result = platform.node || platform.electron
        ? Buffer.allocUnsafe(length)
        : new buffer.constructor(length);
    buffer.copy(result);
    return result;
}
function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
}
function cloneDataView(dataView, isDeep) {
    var buffer = isDeep
        ? cloneArrayBuffer(dataView.buffer)
        : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var Buffer$1 = /*#__PURE__*/Object.freeze({
    bufferToArrayBuffer: bufferToArrayBuffer,
    arrayBufferToBuffer: arrayBufferToBuffer,
    arrayBufferToAudioBuffer: arrayBufferToAudioBuffer,
    blobToArrayBuffer: blobToArrayBuffer,
    blobToAudioBuffer: blobToAudioBuffer,
    arrayBufferToBlob: arrayBufferToBlob,
    audioBufferToArrayBuffer: audioBufferToArrayBuffer,
    arrayBufferToAcResource: arrayBufferToAcResource,
    mergeArraybuffer: mergeArraybuffer,
    mergeAduioBuffer: mergeAduioBuffer,
    cloneBuffer: cloneBuffer,
    cloneArrayBuffer: cloneArrayBuffer,
    cloneDataView: cloneDataView
});

function envJudgment(methodName) {
    if (!platform.node && !platform.electron) {
        logError('Environment', "[ NodeUtils." + methodName + " ] method Must be used in \"node\" or \"electron\"", true);
    }
}
function copyForder(fromPath, toPath, needCompolete) {
    envJudgment('copyForder');
    return new Promise(function (_resolve) {
        if (!needCompolete)
            return _resolve();
    });
}
function deleteForder(path, needCompolete) {
    envJudgment('deleteForder');
    return new Promise(function (_resolve) {
        var fs = require('fs');
        var resolve = require('path').resolve;
        if (!fs.existsSync(path))
            return _resolve();
        function insertDeleteForder(_path) {
            if (fs.existsSync(_path)) {
                var files = fs.readdirSync(_path);
                for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
                    var file = files_2[_i];
                    var curPath = resolve(_path, file);
                    fs.statSync(curPath).isDirectory()
                        ? insertDeleteForder(curPath)
                        : fs.unlinkSync(curPath);
                }
            }
        }
        function isDeleteCompolete() {
            process.nextTick(function () {
            });
        }
        insertDeleteForder(path);
        needCompolete
            ? isDeleteCompolete()
            : _resolve();
    });
}
function transferFile(from, to) {
    envJudgment('transferFile');
    return new Promise(function (_resolve) {
        var fs = require('fs');
        var read_stream = fs.createReadStream(from);
        var write_stream = fs.createWriteStream(to);
        read_stream.pipe(write_stream);
        read_stream.on('end', function (err) {
            if (err)
                throw err;
            _resolve();
        });
    });
}
function getIp(family) {
    if (family === void 0) { family = 'IPv4'; }
    envJudgment('getIp');
    var interfaces = require('os').networkInterfaces();
    return Object.keys(interfaces).reduce(function (arr, x) {
        var interfce = interfaces[x];
        return arr.concat(Object.keys(interfce)
            .filter(function (x) { return interfce[x].family === family && !interfce[x].internal; })
            .map(function (x) { return interfce[x].address; }));
    }, []);
}

var NodeUtils = /*#__PURE__*/Object.freeze({
    copyForder: copyForder,
    deleteForder: deleteForder,
    transferFile: transferFile,
    getIp: getIp
});

function typeJudgment(matrix) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (!Array.isArray(matrix))
        logError('Matrix', "[ Matrix array ] must be a \"array\", but now is [ " + matrix + " ]", true);
    if (matrix.length < 7) {
        logError('Matrix', "[ Matrix array ] must be a \"matrix 3d array\", but the current [ matrix length ] is less than 7, you can use \"getElmentMatrix\" method get matrix 3d array", true);
    }
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var arg = args_1[_a];
        if (!isNumber(arg)) {
            logError('Matrix', "[ " + arg + " ] must be a \"number\" and must be \"0\" or \"1\", but now is [ " + typeof arg + " ]", true);
        }
    }
}
function getElmentMatrix(el) {
    var initMatrix = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
    if (!el)
        return initMatrix;
    var matrix = getComputedStyle(el).transform;
    matrix === 'none' && (matrix = initMatrix);
    matrix = /(\w+\()([^\)]+)/g.exec(matrix)[2].split(',').map(function (v) { return Number(v); });
    if (matrix.length < 7) {
        matrix = [matrix[0], matrix[1], 0, 0, matrix[2], matrix[3], 0, 0, 0, 0, 1, 0, matrix[4], matrix[5], 0, 1];
    }
    return matrix;
}
function createElementMatrix(arr) {
    typeJudgment(arr);
    var newMatrix = 'matrix3d(';
    for (var i = 0; i < arr.length; i++) {
        newMatrix += i != arr.length - 1
            ? arr[i] + ','
            : arr[i];
    }
    return newMatrix += ')';
}
function rotate3d(matrix, x, y, z, deg) {
    typeJudgment(matrix, x, y, z, deg);
    var agl = Math.PI * deg / 180;
    var numSqrt = Math.sqrt(x * x + y * y + z * z);
    var cos = Math.cos(agl);
    var sin = Math.sin(agl);
    var ux = x / numSqrt;
    var uy = y / numSqrt;
    var uz = z / numSqrt;
    var negative = 1 - cos;
    var r0 = ux * ux * negative + cos, r1 = ux * uy * negative + uz * sin, r2 = ux * uz * negative - uy * sin, r4 = ux * uy * negative - uz * sin, r5 = uy * uy * negative + cos, r6 = uz * uy * negative + ux * sin, r8 = ux * uz * negative + uy * sin, r9 = uy * uz * negative - ux * sin, r10 = uz * uz * negative + cos;
    var d0 = matrix[0] * r0 + matrix[4] * r1 + matrix[8] * r2, d1 = matrix[1] * r0 + matrix[5] * r1 + matrix[9] * r2, d2 = matrix[2] * r0 + matrix[6] * r1 + matrix[10] * r2, d3 = matrix[3] * r0 + matrix[7] * r1 + matrix[11] * r2, d4 = matrix[0] * r4 + matrix[4] * r5 + matrix[8] * r6, d5 = matrix[1] * r4 + matrix[5] * r5 + matrix[9] * r6, d6 = matrix[2] * r4 + matrix[6] * r5 + matrix[10] * r6, d7 = matrix[3] * r4 + matrix[7] * r5 + matrix[11] * r6, d8 = matrix[0] * r8 + matrix[4] * r9 + matrix[8] * r10, d9 = matrix[1] * r8 + matrix[5] * r9 + matrix[9] * r10, d10 = matrix[2] * r8 + matrix[6] * r9 + matrix[10] * r10, d11 = matrix[3] * r8 + matrix[7] * r9 + matrix[11] * r10;
    return [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, matrix[12], matrix[13], matrix[14], matrix[15]];
}
function rotateX(matrix, deg) {
    return rotate3d(matrix, 1, 0, 0, deg);
}
function rotateY(matrix, deg) {
    return rotate3d(matrix, 0, 1, 0, deg);
}
function rotateZ(matrix, deg) {
    return rotate3d(matrix, 0, 0, 1, deg);
}
function rotate(matrix, deg) {
    return rotate3d(matrix, 0, 0, 1, deg);
}
function translate3d(matrix, x, y, z) {
    typeJudgment(matrix, x, y, z);
    var c12 = x * matrix[0] + y * matrix[4] + z * matrix[8] + matrix[12], c13 = x * matrix[1] + y * matrix[5] + z * matrix[9] + matrix[13], c14 = x * matrix[2] + y * matrix[6] + z * matrix[10] + matrix[14], c15 = x * matrix[3] + y * matrix[7] + z * matrix[11] + matrix[15];
    return [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6], matrix[7], matrix[8], matrix[9], matrix[10], matrix[11], c12, c13, c14, c15];
}
function translateX(matrix, x) {
    return translate3d(matrix, x, 0, 0);
}
function translateY(matrix, y) {
    return translate3d(matrix, 0, y, 0);
}
function translateZ(matrix, z) {
    return translate3d(matrix, 0, 0, z);
}
function translate(matrix, x, y) {
    return translate3d(matrix, x, y, 0);
}
function scale3d(matrix, x, y, z) {
    typeJudgment(matrix, x, y, z);
    var s0 = matrix[0] * x, s4 = matrix[4] * y, s8 = matrix[8] * z, s1 = matrix[1] * x, s5 = matrix[5] * y, s9 = matrix[9] * z, s2 = matrix[2] * x, s6 = matrix[6] * y, s10 = matrix[10] * z, s3 = matrix[3] * x, s7 = matrix[7] * y, s11 = matrix[11] * z;
    return [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, matrix[12], matrix[13], matrix[14], matrix[15]];
}
function scaleX(matrix, x) {
    return scale3d(matrix, x, 1, 1);
}
function scaleY(matrix, y) {
    return scale3d(matrix, 1, y, 1);
}
function scaleZ(matrix, z) {
    return scale3d(matrix, 1, 1, z);
}
function scale(matrix, x, y) {
    return scale3d(matrix, x, y, 1);
}
function skew(matrix, x, y) {
    typeJudgment(matrix, x, y);
    var xtan = Math.tan(Math.PI * x / 180);
    var ytan = Math.tan(Math.PI * y / 180);
    var f0 = matrix[0] + matrix[4] * ytan, f1 = matrix[1] + matrix[5] * ytan, f2 = matrix[2] + matrix[6] * ytan, f3 = matrix[3] + matrix[7] * ytan, f4 = matrix[0] * xtan + matrix[4], f5 = matrix[1] * xtan + matrix[5], f6 = matrix[2] * xtan + matrix[6], f7 = matrix[3] * xtan + matrix[7];
    return [f0, f1, f2, f3, f4, f5, f6, f7, matrix[8], matrix[9], matrix[10], matrix[11], matrix[12], matrix[13], matrix[14], matrix[15]];
}
function skewX(matrix, x) {
    return skew(matrix, x, 0);
}
function skewY(matrix, y) {
    return skew(matrix, 0, y);
}
function getAttrTransforms(str) {
    if (!str)
        return [];
    if (!isElement(str) && !isString(str)) {
        logError('Matrix', "[ " + str + " ] must be \"HTMLElement\" or \"string\"", true);
    }
    !isString(str) && (str = str.outerHTML.replace(str.innerHTML, ''));
    console.log(str);
    var reg = /(transform=)?(['"\s])(\w+\([^)]+\))/g;
    var match = [];
    var res;
    while (res = reg.exec(str)) {
        match.push(res[3]);
    }
    return match;
}
function mergeTransforms(arr) {
    if (!Array.isArray(arr))
        logError('Matrix', "[ arr ] must be a \"array\", but now is " + typeof arr, true);
    return arr.join(' ');
}
function setSvgTransform(element, attrs) {
    if (!element || !element.nodeType || element.nodeType !== 1) {
        logError('Matrix', "[ element ] must be a \"HTMLElement\", but now is [ " + (element === document
            ? 'document'
            : typeof element) + " ]", true);
    }
    var originTransforms = getAttrTransforms(element);
    Array.isArray(attrs)
        ? (originTransforms = originTransforms.concat(attrs))
        : originTransforms.push(attrs);
    element.setAttribute('transform', originTransforms.join(' '));
}
var MatrixElement = (function () {
    function MatrixElement(element) {
        this.element = element;
        this.matrixArr = getElmentMatrix(element);
    }
    MatrixElement.prototype.rotate3d = function (x, y, z, deg) {
        this.matrixArr = rotate3d(this.matrixArr, x, y, z, deg);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.rotate = function (deg) {
        this.matrixArr = rotate3d(this.matrixArr, 0, 0, 1, deg);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.rotateX = function (deg) {
        this.matrixArr = rotate3d(this.matrixArr, 1, 0, 0, deg);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.rotateY = function (deg) {
        this.matrixArr = rotate3d(this.matrixArr, 0, 1, 0, deg);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.rotateZ = function (deg) {
        this.matrixArr = rotate3d(this.matrixArr, 0, 0, 1, deg);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.translate3d = function (x, y, z) {
        this.matrixArr = translate3d(this.matrixArr, x, y, z);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.translate = function (x, y) {
        this.matrixArr = translate3d(this.matrixArr, x, y, 0);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.translateX = function (x) {
        this.matrixArr = translate3d(this.matrixArr, x, 0, 0);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.translateY = function (y) {
        this.matrixArr = translate3d(this.matrixArr, 0, y, 0);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.translateZ = function (z) {
        this.matrixArr = translate3d(this.matrixArr, 0, 0, z);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.scale3d = function (x, y, z) {
        this.matrixArr = scale3d(this.matrixArr, x, y, z);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.scale = function (x, y) {
        this.matrixArr = scale3d(this.matrixArr, x, y, 1);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.scaleX = function (x) {
        this.matrixArr = scale3d(this.matrixArr, x, 1, 1);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.scaleY = function (y) {
        this.matrixArr = scale3d(this.matrixArr, 1, y, 1);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.scaleZ = function (z) {
        this.matrixArr = scale3d(this.matrixArr, 1, 1, z);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.skew = function (x, y) {
        this.matrixArr = skew(this.matrixArr, x, y);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.skewX = function (x) {
        this.matrixArr = skew(this.matrixArr, x, 0);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    MatrixElement.prototype.skewY = function (y) {
        this.matrixArr = skew(this.matrixArr, 0, y);
        this.element.style.transform = createElementMatrix(this.matrixArr);
        return this;
    };
    return MatrixElement;
}());
function element(element) {
    if (!element || !element.nodeType || element.nodeType !== 1) {
        logError('Matrix', "[ element ] must be a \"HTMLElement\", but now is [ " + (element === document
            ? 'document'
            : typeof element) + " ]", true);
    }
    return new MatrixElement(element);
}

var Matrix = /*#__PURE__*/Object.freeze({
    getElmentMatrix: getElmentMatrix,
    createElementMatrix: createElementMatrix,
    rotate3d: rotate3d,
    rotateX: rotateX,
    rotateY: rotateY,
    rotateZ: rotateZ,
    rotate: rotate,
    translate3d: translate3d,
    translateX: translateX,
    translateY: translateY,
    translateZ: translateZ,
    translate: translate,
    scale3d: scale3d,
    scaleX: scaleX,
    scaleY: scaleY,
    scaleZ: scaleZ,
    scale: scale,
    skew: skew,
    skewX: skewX,
    skewY: skewY,
    getAttrTransforms: getAttrTransforms,
    mergeTransforms: mergeTransforms,
    setSvgTransform: setSvgTransform,
    element: element
});

function jsonp(url, options) {
    if (!isString(url))
        logError('Net', "[ JSONP url ] must be a \"string\", but now is " + typeof url, true);
    return new Promise(function (resolve, reject) {
        var _a = options || {}, _b = _a.data, data = _b === void 0 ? '' : _b, _c = _a.timeout, timeout = _c === void 0 ? 10000 : _c, _d = _a.callbackName, callbackName = _d === void 0 ? 'jsonp' + Date.now() : _d;
        var script = document.createElement('script');
        var type = url.includes('?') ? '&' : '?';
        var timeoutFlag = false;
        var val = '';
        if (isObject(data)) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    val += "&" + key + "=" + data[key];
                }
            }
        }
        else {
            val = data;
        }
        script.style.display = 'none';
        script.src = url + type + 'callback=' + callbackName + val;
        window[callbackName] = function (result) {
            timeoutFlag = true;
            resolve(result);
            window[callbackName] = undefined;
        };
        script.onerror = function (e) {
            timeoutFlag = true;
            reject(e);
            window[callbackName] && (window[callbackName] = undefined);
        };
        setTimeout(function () {
            if (timeoutFlag)
                return;
            window[callbackName] = function () { return window[callbackName] = undefined; };
            logError('Net', 'request timed out', true);
        }, timeout);
        document.head.appendChild(script);
        document.head.removeChild(script);
    });
}

var Net = /*#__PURE__*/Object.freeze({
    jsonp: jsonp
});

function curry(fun) {
    var length = fun._length || fun.length;
    var catchArgs = [];
    return function loadFun() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var lastLen = length - catchArgs.length;
        var currentLen = args.length;
        if (lastLen < currentLen) {
            logError('FP', "The argument should be \"" + length + "\", but the result is \"" + (catchArgs.length + args.length) + "\"", true);
        }
        if (lastLen === currentLen) {
            return fun.apply(void 0, catchArgs.concat(args));
        }
        catchArgs = catchArgs.concat(args);
        return loadFun;
    };
}
function compose() {
    var funArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        funArgs[_i] = arguments[_i];
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var length = funArgs.length;
        var result = args;
        var initEnv = true;
        while (length--) {
            result = initEnv
                ? funArgs[length].apply(funArgs, result) : funArgs[length](result);
            initEnv && (initEnv = false);
        }
        return result;
    };
}
function prop(key) {
    return curry(function (prop, obj) { return obj[prop]; })(key);
}
var Container = (function () {
    function Container(x) {
        this._value = x;
    }
    Container.prototype.map = function (fun) {
        return new Container(fun(this._value));
    };
    Container.prototype.isUndef = function () {
        return isUndef(this._value);
    };
    Container.prototype.maybeMap = function (fun) {
        return isUndef(this._value)
            ? new Container(this._value)
            : new Container(fun(this._value));
    };
    Container.of = function (x) {
        return new Container(x);
    };
    Container.maybe = function (val, fun) {
        var curryFun = curry(function (val, fun, container) {
            return container.isUndef() ? val : fun(container._value);
        });
        return curryFun(val, fun);
    };
    return Container;
}());

var FP = /*#__PURE__*/Object.freeze({
    curry: curry,
    compose: compose,
    prop: prop,
    Container: Container
});

var EventQueue = (function () {
    function EventQueue(type) {
        this.type = type;
        this.commonFuns = [];
        this.onceFuns = [];
    }
    EventQueue.prototype.on = function (func) {
        if (!isFunction(func))
            logError('Event', "[ registered callback function ] is not a function", true);
        this.commonFuns.push(func);
    };
    EventQueue.prototype.once = function (func) {
        if (!isFunction(func))
            logError('Event', "[ registered callback function ] is not a function", true);
        this.onceFuns.push(func);
    };
    EventQueue.prototype.emit = function (data) {
        var _a = this, commonFuns = _a.commonFuns, onceFuns = _a.onceFuns;
        var event = { data: data, type: this.type };
        for (var _i = 0, commonFuns_1 = commonFuns; _i < commonFuns_1.length; _i++) {
            var fun = commonFuns_1[_i];
            fun(event);
        }
        for (var i = 0; i < onceFuns.length; i++) {
            onceFuns[i](event);
            onceFuns.splice(i, 1);
            i--;
        }
    };
    EventQueue.prototype.emitCommon = function (data) {
        var commonFuns = this.commonFuns;
        for (var _i = 0, commonFuns_2 = commonFuns; _i < commonFuns_2.length; _i++) {
            var fun = commonFuns_2[_i];
            fun({
                type: this.type,
                data: data,
            });
        }
    };
    EventQueue.prototype.emitOnce = function (data) {
        var onceFuns = this.onceFuns;
        for (var i = 0; i < onceFuns.length; i++) {
            onceFuns[i]({
                type: this.type,
                data: data,
            });
            onceFuns.splice(i, 1);
            i--;
        }
    };
    EventQueue.prototype.remove = function (func, keyWord) {
        if (!func) {
            this.commonFuns = [];
            this.onceFuns = [];
            return;
        }
        if (!isFunction(func))
            logError('Event', "[ " + func + " ] is not a function", true);
        if (keyWord && keyWord !== 'common' && keyWord !== 'once') {
            logError('Event', "[ keyWord ] must be a \"common\" or \"once\", But now is " + keyWord, true);
        }
        var _a = this, commonFuns = _a.commonFuns, onceFuns = _a.onceFuns;
        if (!keyWord || keyWord === 'common') {
            for (var i = 0; i < commonFuns.length; i++) {
                if (commonFuns[i] === func) {
                    commonFuns.splice(i, 1);
                    i--;
                }
            }
        }
        if (!keyWord || keyWord === 'once') {
            for (var j = 0; j < onceFuns.length; j++) {
                if (onceFuns[j] === func) {
                    onceFuns.splice(j, 1);
                    j--;
                }
            }
        }
    };
    EventQueue.prototype.removeCommon = function () {
        this.commonFuns = [];
    };
    EventQueue.prototype.removeOnce = function () {
        this.onceFuns = [];
    };
    return EventQueue;
}());
var Event = (function () {
    function Event() {
    }
    Event.prototype.create = function (type) {
        if (!isString(type))
            logError('Event', "[ event name ] is not a string", true);
        if (this[type])
            logError('Event', 'The current queue already exists. Please do not create it again');
        this[type] = new EventQueue(type);
        return this;
    };
    return Event;
}());

var CanvasBanner = (function () {
    function CanvasBanner(option, imgArr) {
        var _this = this;
        this.index = 0;
        this.toggle = false;
        if (!option.dom) {
            logError('Canvas banner', 'DOM element must exist ', true);
        }
        if (!imgArr || imgArr.length < 2) {
            logError('Canvas banner', 'Img array length must be greater than 2', true);
        }
        this.imgArr = imgArr;
        this.option = option;
        this.totalImg = [];
        this.animate = [];
        this.defaultUrl = option.defaultUrl || imgArr[1];
        option.mount = option.mount || 5;
        option.mode = option.mode || 'circle';
        this.createImgDOM()
            .then(function () { return _this.defaultImg(function () { return _this.move(); }); });
    }
    CanvasBanner.prototype.transition = function (randomStr) {
        var _this = this;
        return function (img) {
            if (!img)
                return;
            var _a = _this, animate = _a.animate, imgArr = _a.imgArr;
            var _b = _this.option, dom = _b.dom, mount = _b.mount, swap = _b.swap, speed = _b.speed;
            if (swap) {
                _this.toggle = !_this.toggle;
                _this.option.mode = _this.toggle
                    ? 'circle'
                    : 'rect';
            }
            var mode = _this.option.mode;
            var time = _this.option.time || 0;
            var t = mode === 'circle' ? 0 : 150;
            _this.removeCanvas(dom, animate[animate.length - 1])
                .then(function () {
                _this.animate = [];
                var endFun = function (dom) {
                    _this.index++;
                    if (_this.index > imgArr.length - 1)
                        _this.index = 0;
                    if (_this.over() === false)
                        return;
                    setTimeout(function () {
                        if (randomStr !== _this.randomStr || (!_this.middleware).isanimate)
                            return;
                        _this.move();
                    }, time);
                };
                var _loop_1 = function (i) {
                    setTimeout(function () {
                        if (randomStr !== _this.randomStr)
                            return;
                        var option = {
                            img: img,
                            mode: mode,
                            mount: mount,
                            speed: speed,
                            index: i + 1,
                        };
                        var banner = i === mount - 1
                            ? new Banner(dom, option, _this.middleware, endFun)
                            : new Banner(dom, option, _this.middleware);
                        _this.animate.push(banner);
                    }, t * i);
                };
                for (var i = 0; i < mount; i++) {
                    _loop_1(i);
                }
            });
        };
    };
    CanvasBanner.prototype.stop = function () {
        var _this = this;
        this.middleware.isanimate = false;
        this.animate.forEach(function (val) { return cancelAnimationFrame(_this.getAnimete(val)); });
    };
    CanvasBanner.prototype.defaultImg = function (callback) {
        var url = this.defaultUrl;
        var img = this.createImg(url);
        var canvas = CanvasBanner.createCanvas(this.option.dom);
        var ctx = canvas.getContext('2d');
        img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
            callback && callback();
        };
    };
    CanvasBanner.prototype.createImgDOM = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var imgArr = _this.imgArr;
            var single = 100;
            var all = single * imgArr.length;
            var progress = 0;
            imgArr.forEach(function (url) {
                var img = _this.createImg(url);
                _this.totalImg.push(img);
                img.onload = function () {
                    progress += single;
                    progress === all && resolve();
                };
            });
        });
    };
    CanvasBanner.prototype.move = function () {
        if (this.totalImg.length === 0 || this.start() === false)
            return;
        this.middleware.isanimate = true;
        var randomStr = this.randomStr
            = this.middleware.randomStr
                = CanvasBanner.random(9999999) + CanvasBanner.random(9999999).toString(32);
        this.transition(randomStr)(this.totalImg[this.index]);
    };
    CanvasBanner.prototype.continue = function () {
        if (this.animate.length === 0)
            return;
        this.middleware.isanimate = true;
        var mode = this.option.mode;
        this.animate.forEach(function (val) {
            val[mode + "Move"]();
        });
    };
    CanvasBanner.prototype.preImg = function () {
        this.stop();
        this.index--;
        if (this.index < 0)
            this.index = this.totalImg.length - 1;
        this.move();
    };
    CanvasBanner.prototype.nextImg = function () {
        this.stop();
        this.index++;
        if (this.index > this.totalImg.length - 1)
            this.index = 0;
        this.move();
    };
    CanvasBanner.prototype.getIndex = function () {
        return this.index;
    };
    CanvasBanner.prototype.specify = function (num) {
        if (num > this.totalImg.length - 1 || num < 0) {
            logError('Canvas banner', 'The specified index is incorrect', false, true);
        }
        this.stop();
        this.index = num;
        this.move();
    };
    CanvasBanner.prototype.start = function () { return true; };
    CanvasBanner.prototype.over = function () { return true; };
    CanvasBanner.prototype.createImg = function (url) {
        var img = new Image;
        img.src = url;
        return img;
    };
    CanvasBanner.random = function (max) {
        return parseInt(Math.random() * (max + 1));
    };
    CanvasBanner.createCanvas = function (dom) {
        var canvas = document.createElement('canvas');
        dom.appendChild(canvas);
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        canvas.style.position = 'absolute';
        return canvas;
    };
    CanvasBanner.prototype.getAnimete = function (banner) {
        return banner.requestAnimationFrame;
    };
    CanvasBanner.prototype.removeCanvas = function (dom, banner) {
        return new Promise(function (resolve, reject) {
            var canvas = dom.querySelectorAll('canvas');
            canvas.forEach(function (val, i) {
                i < canvas.length - 1 && dom.removeChild(val);
            });
            if (banner) {
                var _a = banner.option, img = _a.img, width = _a.width, height = _a.height, ctx = _a.ctx;
                ctx.drawImage(img, 0, 0, width, height);
            }
            resolve();
        });
    };
    CanvasBanner.prototype.middleware = function () { };
    return CanvasBanner;
}());
var Banner = (function () {
    function Banner(dom, option, middleware, callback) {
        if (!option || typeof option !== 'object' || !option.img)
            return;
        var canvas = CanvasBanner.createCanvas(dom);
        var width = option.width = canvas.offsetWidth;
        var height = option.height = canvas.offsetHeight;
        option.direct = width > height ? width : height;
        option.speed = option.speed || option.direct / 200;
        this.dom = dom;
        this.middleware = middleware;
        this.callback = callback || (function () { });
        this.ctx = option.ctx = canvas.getContext('2d');
        this.option = option;
        this.requestAnimationFrame = null;
        this.init();
    }
    Banner.prototype.init = function () {
        var _a = this.option, width = _a.width, height = _a.height, ctx = _a.ctx, mode = _a.mode, img = _a.img;
        ctx.drawImage(img, 0, 0, width, height);
        this[mode + "Draw"]();
        this.position();
    };
    Banner.prototype.position = function () {
        var _a = this.option, width = _a.width, height = _a.height, mode = _a.mode, mount = _a.mount, index = _a.index, direct = _a.direct;
        if (mode === 'circle') {
            this.option.x = CanvasBanner.random(width);
            this.option.y = CanvasBanner.random(height);
            this.option.raduis = 0;
        }
        if (mode === 'rect') {
            var singleBar = this.option.singleBar = direct / mount;
            this.option.x = singleBar * (index - 1);
            this.option.add = 0;
        }
    };
    Banner.prototype.circleDraw = function () {
        var _a = this.option, width = _a.width, height = _a.height, ctx = _a.ctx, img = _a.img, x = _a.x, y = _a.y, raduis = _a.raduis;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, raduis, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, width, height);
        ctx.restore();
        this.circleMove();
    };
    Banner.prototype.circleMove = function () {
        var _this = this;
        var isanimate = this.middleware.isanimate;
        var _a = this.option, raduis = _a.raduis, direct = _a.direct, speed = _a.speed;
        this.requestAnimationFrame = requestAnimationFrame(function (_) {
            if (!isanimate)
                return;
            var distance = direct / 400;
            if (raduis > direct / (distance > 1 ? distance : 1)) {
                !!_this.callback && _this.callback(_this.dom);
                return;
            }
            _this.option.raduis += speed / 2;
            _this.circleDraw();
        });
    };
    Banner.prototype.rectDraw = function () {
        var _a = this.option, width = _a.width, height = _a.height, ctx = _a.ctx, img = _a.img, x = _a.x, add = _a.add, singleBar = _a.singleBar;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, 0, singleBar, add);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, width, height);
        ctx.restore();
        this.rectMove();
    };
    Banner.prototype.rectMove = function () {
        var _this = this;
        var _a = this.option, add = _a.add, height = _a.height, speed = _a.speed;
        var isanimate = this.middleware.isanimate;
        this.requestAnimationFrame = requestAnimationFrame(function (_) {
            if (!isanimate)
                return;
            if (add > height) {
                !!_this.callback && _this.callback(_this.dom);
                return;
            }
            _this.option.add += speed;
            _this.rectDraw();
        });
    };
    return Banner;
}());

function workerBody() {
    var _self = this;
    var config = {
        bufferLen: 4096,
        numChannels: 2,
        mimeType: 'audio/wav',
    };
    var recordBuffer = [];
    _self.onmessage = function (e) {
        switch (e.data.command) {
            case 'record':
                recordData(e.data.val);
                break;
            case 'exportWAV':
                exportWAV();
                break;
        }
    };
    function recordData(inputBuffer) {
        var numChannels = config.numChannels;
        for (var i = 0; i < numChannels; i++) {
            if (!recordBuffer[i]) {
                recordBuffer[i] = [];
            }
            recordBuffer[i].push(inputBuffer[i]);
        }
    }
    function exportWAV() {
        var collectRecord = collect();
        var audioBlob = createAudioBlob(collectRecord);
        recordBuffer = [];
        _self.postMessage({
            command: 'exportWAV',
            val: audioBlob,
        });
    }
    function createAudioBlob(collectRecord) {
        var numChannels = config.numChannels, mimeType = config.mimeType;
        var interleaveData = encodeWAV(44100, numChannels, collectRecord);
        return [
            new Blob([interleaveData], { type: mimeType }),
            interleaveData,
        ];
    }
    function collect() {
        var buffers = [];
        for (var i = 0; i < config.numChannels; i++) {
            buffers.push(mergeBuffers(recordBuffer[i]));
        }
        var length = buffers[0].length + buffers[1].length;
        var result = new Float32Array(length);
        var index = 0;
        var inputIndex = 0;
        while (index < length) {
            result[index++] = buffers[0][inputIndex];
            result[index++] = buffers[1][inputIndex];
            inputIndex++;
        }
        return result;
    }
    function mergeBuffers(buffers) {
        var result = new Float32Array(config.bufferLen * buffers.length);
        var offset = 0;
        for (var i = 0; i < buffers.length; i++) {
            result.set(buffers[i], offset);
            offset += buffers[i].length;
        }
        return result;
    }
    function encodeWAV(sampleRate, numChannels, samples) {
        var dataLength = samples.length * numChannels;
        var buffer = new ArrayBuffer(dataLength + 44);
        var view = new DataView(buffer);
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataLength, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * 2, true);
        view.setUint16(32, numChannels * 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, dataLength, true);
        floatTo16BitPCM(view, 44, samples);
        return view;
    }
    function floatTo16BitPCM(output, offset, input) {
        for (var i = 0; i < input.length; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }
    function writeString(view, offset, string) {
        for (var i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
}
var Record = (function () {
    function Record(filename, successFn, errorFn) {
        this.context = AudioCtx;
        this.volume = 1;
        this.worker = Record.inlineWorker(workerBody);
        this.recording = false;
        this.playing = false;
        this.config = {
            bufferLen: 4096,
            numChannels: 2,
        };
        this.filename = filename || 'record';
        this.successFn = successFn || (function () { });
        this.errorFn = errorFn || Record.logError;
        this.listenerWorker();
        this.createEnv();
    }
    Record.prototype.listenerWorker = function () {
        var _this = this;
        this.worker.onmessage = function (e) {
            switch (e.data.command) {
                case 'exportWAV':
                    _this.recordEnded(e.data.val);
                    break;
            }
        };
        this.worker.onerror = this.errorFn;
    };
    Record.prototype.recordEnded = function (_a) {
        var audioBlob = _a[0], interleaveData = _a[1];
        this.audioBlob = audioBlob;
        this.interleaveData = interleaveData.buffer;
        this.audio = null;
        this.recording = false;
        this.successFn();
    };
    Record.prototype.createEnv = function () {
        var _this = this;
        this.connectDevice()
            .then(function (stream) {
            var context = _this.context;
            var _a = _this.config, bufferLen = _a.bufferLen, numChannels = _a.numChannels;
            _this.recorder = context.createScriptProcessor(bufferLen, numChannels, numChannels);
            _this.audioInput = context.createMediaStreamSource(stream);
            _this.recorder.onaudioprocess = function (e) {
                var buffer = [];
                for (var channel = 0; channel < numChannels; channel++) {
                    buffer.push(e.inputBuffer.getChannelData(channel));
                }
                _this.worker.postMessage({
                    command: 'record',
                    val: buffer,
                });
            };
        });
    };
    Record.prototype.connectDevice = function () {
        return navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) { return stream; })
            .catch(this.errorFn);
    };
    Record.prototype.startRecord = function () {
        var _this = this;
        if (this.recording) {
            return this.errorFn("In recording");
        }
        var connect = function () {
            var _a = _this, audioInput = _a.audioInput, recorder = _a.recorder, context = _a.context;
            if (!audioInput) {
                setTimeout(connect);
                return;
            }
            _this.recording = true;
            _this.audioBlob = null;
            audioInput.connect(recorder);
            recorder.connect(context.destination);
        };
        connect();
    };
    Record.prototype.stopRecord = function () {
        if (!this.recording) {
            return this.errorFn("No recording");
        }
        this.recorder.disconnect();
        this.worker.postMessage({
            command: 'exportWAV'
        });
    };
    Record.prototype.play = function () {
        var _this = this;
        if (this.playing)
            return this.errorFn('Is playing');
        if (!this.audioBlob && !this.audio) {
            return this.errorFn("No audio resources");
        }
        this.playing = true;
        if (!this.audio) {
            this.audio = Record.createAudioElement(this.audioBlob);
            this.audio.volume = this.volume;
            this.audio.onended = function (e) {
                _this.playing = false;
            };
        }
        this.audio.play();
    };
    Record.prototype.pause = function () {
        if (!this.playing) {
            return this.errorFn('Not playing');
        }
        this.audio.pause();
        this.playing = false;
    };
    Record.prototype.download = function () {
        if (this.recording)
            return this.errorFn("In recording");
        if (!this.audioBlob)
            return this.errorFn("Audio blob is [" + this.audioBlob + "]");
        Record.download(this.audioBlob, this.filename + '.wav');
    };
    Record.logError = function (infor, isErr) {
        logError('Record', infor, isErr);
    };
    Record.inlineWorker = function (func) {
        return inlineWorker(func);
    };
    Record.download = function (blob, filename) {
        download(blob, filename);
    };
    Record.createAudioElement = function (blob) {
        var url = window.URL.createObjectURL(blob);
        var audio = document.createElement('audio');
        audio.src = url;
        return audio;
    };
    return Record;
}());

var Queue = (function () {
    function Queue() {
        this.fx = [];
        this.lock = false;
        this.isInitEmit = true;
        this.end = function () { };
    }
    Queue.prototype.register = function (fun) {
        if (!isFunction(fun))
            logError('Queue', "[ register function ] must be \"function\", but now is " + typeof fun, true);
        var _a = this, fx = _a.fx, isInitEmit = _a.isInitEmit;
        var queue_fun = function (next) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            fun.apply(void 0, [next].concat(args));
        };
        fx.push(queue_fun);
        if (isInitEmit) {
            this.lock = false;
            this.isInitEmit = false;
            this.emit();
        }
        return this;
    };
    Queue.prototype.emit = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = this, fx = _a.fx, lock = _a.lock;
        if (lock) {
            return this;
        }
        if (!fx.length) {
            this.end.apply(this, args);
            this.isInitEmit = true;
            return this;
        }
        var currentFunc = fx.shift();
        if (currentFunc) {
            this.lock = true;
            currentFunc.apply(void 0, [function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }
                    _this.lock = false;
                    _this.emit.apply(_this, params);
                }].concat(args));
        }
        return this;
    };
    Queue.prototype.remove = function (start, end) {
        if (end === void 0) { end = 1; }
        this.fx.splice(start, end);
        return this;
    };
    return Queue;
}());

var index = {
    AudioContext: new AudioContext(),
    CanvasBanner: CanvasBanner,
    NodeUtils: NodeUtils,
    Matrix: Matrix,
    Buffer: Buffer$1,
    Record: Record,
    Utils: Utils,
    Queue: Queue,
    Event: Event,
    Net: Net,
    FP: FP,
    e: null,
};

// export default index;
window.a = index
