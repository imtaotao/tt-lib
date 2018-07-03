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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvcXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFlOUM7SUFNRTtRQUNFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFBO1FBQ1osSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUE7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7UUFDdEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxjQUFPLENBQUMsQ0FBQTtJQUNyQixDQUFDO0lBRU0sd0JBQVEsR0FBZixVQUFvQixHQUFrQjtRQUNwQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztZQUFFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsNERBQXdELE9BQU8sR0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQzdHLElBQUEsU0FBeUIsRUFBdkIsVUFBRSxFQUFFLDBCQUFVLENBQVM7UUFDL0IsSUFBTSxTQUFTLEdBQWdCLFVBQUMsSUFBSTtZQUFFLGNBQU87aUJBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztnQkFBUCw2QkFBTzs7WUFDNUMsR0FBRyxnQkFBQyxJQUFJLFNBQUssSUFBSSxHQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUVELEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFbEIsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQTtZQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtZQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7U0FDWjtRQUVELE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVPLG9CQUFJLEdBQVo7UUFBQSxpQkFzQkM7UUF0QmEsY0FBYTthQUFiLFVBQWEsRUFBYixxQkFBYSxFQUFiLElBQWE7WUFBYix5QkFBYTs7UUFDbkIsSUFBQSxTQUFtQixFQUFqQixVQUFFLEVBQUUsY0FBSSxDQUFTO1FBQ3pCLElBQUksSUFBSSxFQUFFO1lBQUUsT0FBTyxJQUFJLENBQUE7U0FBRTtRQUV6QixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRTtZQUNkLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLElBQUksRUFBQztZQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtZQUN0QixPQUFPLElBQUksQ0FBQTtTQUNaO1FBRUQsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFBO1FBRTlCLElBQUksV0FBVyxFQUFFO1lBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7WUFFaEIsV0FBVyxnQkFBQztvQkFBQyxnQkFBUzt5QkFBVCxVQUFTLEVBQVQscUJBQVMsRUFBVCxJQUFTO3dCQUFULDJCQUFTOztvQkFDcEIsS0FBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUE7b0JBQ2pCLEtBQUksQ0FBQyxJQUFJLE9BQVQsS0FBSSxFQUFTLE1BQU0sRUFBQztnQkFDdEIsQ0FBQyxTQUFLLElBQUksR0FBQztTQUNaO1FBRUQsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRU0sc0JBQU0sR0FBYixVQUFlLEtBQVksRUFBRSxHQUFPO1FBQVAsb0JBQUEsRUFBQSxPQUFPO1FBQ2xDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUUxQixPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyxBQTVERCxJQTREQyJ9