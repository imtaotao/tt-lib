import { logError, isUndef } from './utils';
export function curry(fun) {
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
export function compose() {
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
export function prop(key) {
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
export { Container };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25hbF9wYXJhZGlnbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9mdW5jdGlvbmFsX3BhcmFkaWdtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBRTNDLE1BQU0sZ0JBQWlCLEdBQVk7SUFDakMsSUFBTSxNQUFNLEdBQVMsR0FBSSxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFBO0lBQy9DLElBQUksU0FBUyxHQUFTLEVBQUUsQ0FBQTtJQUV4QixNQUFNLENBQUM7UUFBa0IsY0FBTzthQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87WUFBUCx5QkFBTzs7UUFDOUIsSUFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUE7UUFDekMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUM5QixFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN6QixRQUFRLENBQUMsSUFBSSxFQUFFLDhCQUEyQixNQUFNLGlDQUF5QixTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLFFBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNuSCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLEdBQUcsZUFBSSxTQUFTLFFBQUssSUFBSSxHQUFDO1FBQ25DLENBQUM7UUFDRCxTQUFTLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVsQyxNQUFNLENBQUMsT0FBTyxDQUFBO0lBQ2hCLENBQUMsQ0FBQTtBQUNILENBQUM7QUFFRCxNQUFNO0lBQW1CLGlCQUFxQjtTQUFyQixVQUFxQixFQUFyQixxQkFBcUIsRUFBckIsSUFBcUI7UUFBckIsNEJBQXFCOztJQUM1QyxNQUFNLENBQUM7UUFBVSxjQUFhO2FBQWIsVUFBYSxFQUFiLHFCQUFhLEVBQWIsSUFBYTtZQUFiLHlCQUFhOztRQUM1QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFBO1FBQzNCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQTtRQUNqQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUE7UUFFbEIsT0FBTyxNQUFNLEVBQUUsRUFBRSxDQUFDO1lBQ2hCLE1BQU0sR0FBRyxPQUFPO2dCQUNkLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQWYsT0FBTyxFQUFZLE1BQU0sRUFDM0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUUzQixPQUFPLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUE7UUFDOUIsQ0FBQztRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUE7SUFDZixDQUFDLENBQUE7QUFDSCxDQUFDO0FBRUQsTUFBTSxlQUFnQixHQUFPO0lBQzNCLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBQyxJQUFRLEVBQUUsR0FBVSxJQUFLLE9BQUEsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFULENBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3hELENBQUM7QUFHRDtJQUVFLG1CQUFvQixDQUFLO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0lBQ2pCLENBQUM7SUFFTSx1QkFBRyxHQUFWLFVBQVksR0FBWTtRQUN0QixNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBQ3hDLENBQUM7SUFFTSwyQkFBTyxHQUFkO1FBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDN0IsQ0FBQztJQUVNLDRCQUFRLEdBQWYsVUFBaUIsR0FBWTtRQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDekIsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDNUIsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUNyQyxDQUFDO0lBR0QsWUFBRSxHQURGLFVBQ0ksQ0FBSztRQUNQLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN6QixDQUFDO0lBR0QsZUFBSyxHQURMLFVBQ08sR0FBTyxFQUFFLEdBQVk7UUFDMUIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFVBQUMsR0FBTyxFQUFFLEdBQVksRUFBRSxTQUFtQjtZQUNoRSxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDMUQsQ0FBQyxDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUMzQixDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBakNELElBaUNDIn0=