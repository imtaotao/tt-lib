import { logError, isObject } from './utils';
var ResponseData = (function () {
    function ResponseData(data, responseCallback) {
        if (!isObject(data) && !Array.isArray(data)) {
            logError('Response data', "[ response data ] must be a \"object\" or \"array\", but now is a " + typeof data, true);
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
                    _self.responseCallback(this, oldArray, null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2VfZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9yZXNwb25zZV9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBRTVDO0lBS0Usc0JBQW1CLElBQW1CLEVBQUUsZ0JBQTBCO1FBQ2hFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUMsUUFBUSxDQUFDLGVBQWUsRUFBRSx1RUFBaUUsT0FBTyxJQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDakgsQ0FBQztRQUVELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO1FBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsSUFBSSxDQUFDLGNBQU8sQ0FBQyxDQUFDLENBQUE7UUFFdEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBQy9FLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDcEIsQ0FBQztJQUdELDhCQUFPLEdBQVAsVUFBUSxHQUFVLEVBQUUsSUFBYztRQUFsQyxpQkFvQ0M7UUFsQ0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNuQyxDQUFDO2dDQUdVLEdBQUc7WUFDWixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7a0NBQVM7WUFFdEMsSUFB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