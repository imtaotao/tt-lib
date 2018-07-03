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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2VfZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9yZXNwb25zZV9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBRTVDO0lBS0Usc0JBQW1CLElBQW1CLEVBQUUsZ0JBQTBCO1FBQ2hFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNDLFFBQVEsQ0FBQyxlQUFlLEVBQUUseUVBQWtFLE9BQU8sSUFBSSxPQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDbEg7UUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtRQUN0QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLElBQUksQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFBO1FBRXRELElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3BCLENBQUM7SUFHRCw4QkFBTyxHQUFQLFVBQVEsR0FBVSxFQUFFLElBQWM7UUFBbEMsaUJBb0NDO1FBbENDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN0QixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ2xDO2dDQUdVLEdBQUc7WUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUM7a0NBQVU7WUFFdEMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3JCLElBQUksT0FBTyxHQUFPLElB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