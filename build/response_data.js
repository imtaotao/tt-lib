import { logError, isObject } from './utils';
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
export function createResponseData(data, responseCallback) {
    new ResponseData(data, responseCallback);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2VfZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9yZXNwb25zZV9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBRTVDO0lBS0Usc0JBQW1CLElBQW1CLEVBQUUsZ0JBQTBCO1FBQ2hFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUMsUUFBUSxDQUFDLGVBQWUsRUFBRSx5RUFBa0UsT0FBTyxJQUFJLE9BQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNuSCxDQUFDO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7UUFDdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixJQUFJLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQTtRQUV0RCxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFDL0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNwQixDQUFDO0lBR0QsOEJBQU8sR0FBUCxVQUFRLEdBQVUsRUFBRSxJQUFjO1FBQWxDLGlCQW9DQztRQWxDQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ25DLENBQUM7Z0NBR1UsR0FBRztZQUNaLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztrQ0FBUztZQUV0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