import { logError, isFunction } from './utils';
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
export { Queue };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvcXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFlOUM7SUFNRTtRQUNFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFBO1FBQ1osSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUE7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7UUFDdEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxjQUFPLENBQUMsQ0FBQTtJQUNyQixDQUFDO0lBRU0sd0JBQVEsR0FBZixVQUFvQixHQUFrQjtRQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsNERBQXdELE9BQU8sR0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQzdHLElBQUEsU0FBeUIsRUFBdkIsVUFBRSxFQUFFLDBCQUFVLENBQVM7UUFDL0IsSUFBTSxTQUFTLEdBQWdCLFVBQUMsSUFBSTtZQUFFLGNBQU87aUJBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztnQkFBUCw2QkFBTzs7WUFDNUMsR0FBRyxnQkFBQyxJQUFJLFNBQUssSUFBSSxHQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUVELEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFbEIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFBO1lBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUNiLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVPLG9CQUFJLEdBQVo7UUFBQSxpQkFzQkM7UUF0QmEsY0FBYTthQUFiLFVBQWEsRUFBYixxQkFBYSxFQUFiLElBQWE7WUFBYix5QkFBYTs7UUFDbkIsSUFBQSxTQUFtQixFQUFqQixVQUFFLEVBQUUsY0FBSSxDQUFTO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFBO1FBQUMsQ0FBQztRQUV6QixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLEVBQVEsSUFBSSxFQUFDO1lBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO1lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUE7UUFDYixDQUFDO1FBRUQsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFBO1FBRTlCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7WUFFaEIsV0FBVyxnQkFBQztvQkFBQyxnQkFBUzt5QkFBVCxVQUFTLEVBQVQscUJBQVMsRUFBVCxJQUFTO3dCQUFULDJCQUFTOztvQkFDcEIsS0FBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUE7b0JBQ2pCLEtBQUksQ0FBQyxJQUFJLE9BQVQsS0FBSSxFQUFTLE1BQU0sRUFBQztnQkFDdEIsQ0FBQyxTQUFLLElBQUksR0FBQztRQUNiLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVNLHNCQUFNLEdBQWIsVUFBZSxLQUFZLEVBQUUsR0FBTztRQUFQLG9CQUFBLEVBQUEsT0FBTztRQUNsQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFFMUIsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNiLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyxBQTVERCxJQTREQyJ9