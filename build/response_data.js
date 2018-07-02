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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2VfZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9yZXNwb25zZV9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBRTVDO0lBS0Usc0JBQW1CLElBQW1CLEVBQUUsZ0JBQTBCO1FBQ2hFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsdUVBQWlFLE9BQU8sSUFBTSxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ2hIO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7UUFDdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixJQUFJLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQTtRQUV0RCxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFDL0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNwQixDQUFDO0lBR0QsOEJBQU8sR0FBUCxVQUFRLEdBQVUsRUFBRSxJQUFjO1FBQWxDLGlCQW9DQztRQWxDQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUNsQztnQ0FHVSxHQUFHO1lBQ1osSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO2tDQUFVO1lBRXRDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNyQixJQUFJLE9BQU8sR0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUV2QyxPQUFPO2dCQUNMLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDbkIsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRW5CLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtnQkFDOUIsR0FBRyxFQUFFLFVBQUMsTUFBVTtvQkFDZCxJQUFJLE1BQU0sS0FBSyxNQUFNO3dCQUFFLE9BQU07b0JBRTdCLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7d0JBQzdDLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO3FCQUM5QjtvQkFFRCxLQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7b0JBQ3pELE1BQU0sR0FBRyxNQUFNLENBQUE7Z0JBQ2pCLENBQUM7Z0JBQ0QsR0FBRyxFQUFFLGNBQU0sT0FBQSxNQUFNLEVBQU4sQ0FBTTthQUNsQixDQUFDLENBQUE7WUFHRixJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUM3QyxPQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7YUFDOUI7UUFDSCxDQUFDOztRQTVCRCxLQUFLLElBQU0sR0FBRyxJQUFJLEdBQUc7b0JBQVYsR0FBRztTQTRCYjtJQUNILENBQUM7SUFHRCx3Q0FBaUIsR0FBakIsVUFBbUIsS0FBVyxFQUFFLElBQWM7UUFDNUMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFBO1FBQ2xCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUE7UUFDakMsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQTtnQ0FFcEMsQ0FBQztZQUNSLElBQU0sVUFBVSxHQUFHLE9BQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBR2xDLE1BQU0sQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRTtnQkFDOUMsS0FBSztvQkFBRSxjQUFPO3lCQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87d0JBQVAseUJBQU87O29CQUVaLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBRzVCLElBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO29CQUV0RCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtvQkFDekIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFBO29CQUV4RCxPQUFPLE1BQU0sQ0FBQTtnQkFDZixDQUFDO2dCQUNELFFBQVEsRUFBRSxJQUFJO2dCQUNkLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixZQUFZLEVBQUUsSUFBSTthQUNuQixDQUFDLENBQUE7UUFDSixDQUFDOztRQXJCRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO29CQUFuQyxDQUFDO1NBcUJUO1FBR0QsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUE7SUFDNUMsQ0FBQztJQUVELDJCQUFJLEdBQUosVUFBTSxLQUFjO1FBQ2xCLE9BQU8sT0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFJLENBQUE7SUFDcEMsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQTVGRCxJQTRGQztBQUVELE1BQU0sNkJBQThCLElBQW1CLEVBQUUsZ0JBQTBCO0lBQ2pGLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0FBQzFDLENBQUMifQ==