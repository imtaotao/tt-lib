var Queue = (function () {
    function Queue() {
        this.fx = [];
        this.lock = false;
        this.isInitEmit = true;
        this.end = function () { };
    }
    Queue.prototype.register = function (fun) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvcXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ0JBO0lBTUU7UUFDRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQTtRQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFBO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO1FBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsY0FBTyxDQUFDLENBQUE7SUFDckIsQ0FBQztJQUVNLHdCQUFRLEdBQWYsVUFBb0IsR0FBa0I7UUFDOUIsSUFBQSxTQUF5QixFQUF2QixVQUFFLEVBQUUsMEJBQVUsQ0FBUztRQUMvQixJQUFNLFNBQVMsR0FBZ0IsVUFBQyxJQUFJO1lBQUUsY0FBTztpQkFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO2dCQUFQLDZCQUFPOztZQUM1QyxHQUFHLGdCQUFDLElBQUksU0FBSyxJQUFJLEdBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBRUQsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUVsQixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUE7WUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7WUFDdkIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ2IsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRU8sb0JBQUksR0FBWjtRQUFBLGlCQXNCQztRQXRCYSxjQUFhO2FBQWIsVUFBYSxFQUFiLHFCQUFhLEVBQWIsSUFBYTtZQUFiLHlCQUFhOztRQUNuQixJQUFBLFNBQW1CLEVBQWpCLFVBQUUsRUFBRSxjQUFJLENBQVM7UUFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUE7UUFBQyxDQUFDO1FBRXpCLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxJQUFJLEVBQUM7WUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7WUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQTtRQUNiLENBQUM7UUFFRCxJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUE7UUFFOUIsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtZQUVoQixXQUFXLGdCQUFDO29CQUFDLGdCQUFTO3lCQUFULFVBQVMsRUFBVCxxQkFBUyxFQUFULElBQVM7d0JBQVQsMkJBQVM7O29CQUNwQixLQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQTtvQkFDakIsS0FBSSxDQUFDLElBQUksT0FBVCxLQUFJLEVBQVMsTUFBTSxFQUFDO2dCQUN0QixDQUFDLFNBQUssSUFBSSxHQUFDO1FBQ2IsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRU0sc0JBQU0sR0FBYixVQUFlLEtBQVksRUFBRSxHQUFPO1FBQVAsb0JBQUEsRUFBQSxPQUFPO1FBQ2xDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUUxQixNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUNILFlBQUM7QUFBRCxDQUFDLEFBM0RELElBMkRDIn0=