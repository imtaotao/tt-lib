import { logError } from './utils';
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
export { CanvasBanner };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzX2Jhbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9jYW52YXNfYmFubmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFFbEM7SUFrQkUsc0JBQW9CLE1BQTZCLEVBQUUsTUFBZTtRQUFsRSxpQkFpQkM7UUFsQ08sVUFBSyxHQUFHLENBQUMsQ0FBQTtRQUlULFdBQU0sR0FBSSxLQUFLLENBQUE7UUFjckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNoQixRQUFRLENBQUMsZUFBZSxFQUFFLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFBO1FBQzVELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsUUFBUSxDQUFDLGVBQWUsRUFBRSx5Q0FBeUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUM1RSxDQUFDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoRCxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFBO1FBQ2hDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUE7UUFFckMsSUFBSSxDQUFDLFlBQVksRUFBRTthQUNsQixJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FB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