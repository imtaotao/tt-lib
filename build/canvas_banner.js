import { logError } from './utils';
var Slide = (function () {
    function Slide(option, imgArr) {
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
    Slide.prototype.transition = function (randomStr) {
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
    Slide.prototype.stop = function () {
        var _this = this;
        this.middleware.isanimate = false;
        this.animate.forEach(function (val) { return cancelAnimationFrame(_this.getAnimete(val)); });
    };
    Slide.prototype.defaultImg = function (callback) {
        var url = this.defaultUrl;
        var img = this.createImg(url);
        var canvas = Slide.createCanvas(this.option.dom);
        var ctx = canvas.getContext('2d');
        img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
            callback && callback();
        };
    };
    Slide.prototype.createImgDOM = function () {
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
    Slide.prototype.move = function () {
        if (this.totalImg.length === 0 || this.start() === false)
            return;
        this.middleware.isanimate = true;
        var randomStr = this.randomStr
            = this.middleware.randomStr
                = Slide.random(9999999) + Slide.random(9999999).toString(32);
        this.transition(randomStr)(this.totalImg[this.index]);
    };
    Slide.prototype.continue = function () {
        if (this.animate.length === 0)
            return;
        this.middleware.isanimate = true;
        var mode = this.option.mode;
        this.animate.forEach(function (val) {
            val[mode + "Move"]();
        });
    };
    Slide.prototype.preImg = function () {
        this.stop();
        this.index--;
        if (this.index < 0)
            this.index = this.totalImg.length - 1;
        this.move();
    };
    Slide.prototype.nextImg = function () {
        this.stop();
        this.index++;
        if (this.index > this.totalImg.length - 1)
            this.index = 0;
        this.move();
    };
    Slide.prototype.getIndex = function () {
        return this.index;
    };
    Slide.prototype.specify = function (num) {
        if (num > this.totalImg.length - 1 || num < 0) {
            logError('Canvas banner', 'The specified index is incorrect', false, true);
        }
        this.stop();
        this.index = num;
        this.move();
    };
    Slide.prototype.start = function () { return true; };
    Slide.prototype.over = function () { return true; };
    Slide.prototype.createImg = function (url) {
        var img = new Image;
        img.src = url;
        return img;
    };
    Slide.random = function (max) {
        return parseInt(Math.random() * (max + 1));
    };
    Slide.createCanvas = function (dom) {
        var canvas = document.createElement('canvas');
        dom.appendChild(canvas);
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        canvas.style.position = 'absolute';
        return canvas;
    };
    Slide.prototype.getAnimete = function (banner) {
        return banner.requestAnimationFrame;
    };
    Slide.prototype.removeCanvas = function (dom, banner) {
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
    Slide.prototype.middleware = function () { };
    return Slide;
}());
export { Slide };
var Banner = (function () {
    function Banner(dom, option, middleware, callback) {
        if (!option || typeof option !== 'object' || !option.img)
            return;
        var canvas = Slide.createCanvas(dom);
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
            this.option.x = Slide.random(width);
            this.option.y = Slide.random(height);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzX2Jhbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9jYW52YXNfYmFubmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFFbEM7SUFrQkUsZUFBb0IsTUFBc0IsRUFBRSxNQUFlO1FBQTNELGlCQWlCQztRQWxDTyxVQUFLLEdBQUcsQ0FBQyxDQUFBO1FBSVQsV0FBTSxHQUFJLEtBQUssQ0FBQTtRQWNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLFFBQVEsQ0FBQyxlQUFlLEVBQUUseUJBQXlCLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDNUQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxRQUFRLENBQUMsZUFBZSxFQUFFLHlDQUF5QyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQzVFLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTtRQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2hELE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUE7UUFDaEMsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQTtRQUVyQyxJQUFJLENBQUMsWUFBWSxFQUFFO2FBQ2xCLElBQUksQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFD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