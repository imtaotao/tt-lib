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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzX2Jhbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9jYW52YXNfYmFubmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFFbEM7SUFrQkUsZUFBb0IsTUFBc0IsRUFBRSxNQUFlO1FBQTNELGlCQWlCQztRQWxDTyxVQUFLLEdBQUcsQ0FBQyxDQUFBO1FBSVQsV0FBTSxHQUFJLEtBQUssQ0FBQTtRQWNyQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNmLFFBQVEsQ0FBQyxlQUFlLEVBQUUseUJBQXlCLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDM0Q7UUFDRCxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2hDLFFBQVEsQ0FBQyxlQUFlLEVBQUUseUNBQXlDLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDM0U7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTtRQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2hELE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUE7UUFDaEMsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQTtRQUVyQyxJQUFJLENBQUMsWUFBWSxFQUFFO2FBQ2xCLElBQUksQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLElBQUksRUFBRSxFQUFYLENBQVcs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