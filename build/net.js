import { isObject, isString, logError } from './utils';
export function jsonp(url, options) {
    if (!isString(url))
        logError('Net', "[ JSONP url ] must be a \"string\", but now is " + typeof url, true);
    return new Promise(function (resolve, reject) {
        var _a = options || {}, _b = _a.data, data = _b === void 0 ? '' : _b, _c = _a.timeout, timeout = _c === void 0 ? 10000 : _c, _d = _a.callbackName, callbackName = _d === void 0 ? 'jsonp' + Date.now() : _d;
        var script = document.createElement('script');
        var type = url.includes('?') ? '&' : '?';
        var timeoutFlag = false;
        var val = '';
        if (isObject(data)) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    val += "&" + key + "=" + data[key];
                }
            }
        }
        else {
            val = data;
        }
        script.style.display = 'none';
        script.src = url + type + 'callback=' + callbackName + val;
        window[callbackName] = function (result) {
            timeoutFlag = true;
            resolve(result);
            window[callbackName] = undefined;
        };
        script.onerror = function (e) {
            timeoutFlag = true;
            reject(e);
            window[callbackName] && (window[callbackName] = undefined);
        };
        setTimeout(function () {
            if (timeoutFlag)
                return;
            window[callbackName] = function () { return window[callbackName] = undefined; };
            logError('Net', 'request timed out', true);
        }, timeout);
        document.head.appendChild(script);
        document.head.removeChild(script);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL25ldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFFdEQsTUFBTSxnQkFBaUIsR0FBVSxFQUFFLE9BSWxDO0lBQ0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxRQUFRLENBQUMsS0FBSyxFQUFFLG9EQUFnRCxPQUFPLEdBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUN2RyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtRQUMzQixJQUFBLGtCQUlXLEVBSGIsWUFBUyxFQUFULDhCQUFTLEVBQ1QsZUFBZSxFQUFmLG9DQUFlLEVBQ2Ysb0JBQW1DLEVBQW5DLHdEQUFtQyxDQUN0QjtRQUVqQixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQy9DLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBO1FBRTFDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQTtRQUN2QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUE7UUFFWixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEdBQUcsQ0FBQSxDQUFFLElBQUksR0FBRyxJQUFJLElBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QixHQUFHLElBQUksTUFBSSxHQUFHLFNBQUksSUFBSSxDQUFDLEdBQUcsQ0FBRyxDQUFBO2dCQUMvQixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEdBQUcsR0FBRyxJQUFJLENBQUE7UUFDWixDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBO1FBQzdCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxXQUFXLEdBQUcsWUFBWSxHQUFHLEdBQUcsQ0FBQTtRQUUxRCxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsVUFBQyxNQUFVO1lBQ2hDLFdBQVcsR0FBRyxJQUFJLENBQUE7WUFDbEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ2YsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFNBQVMsQ0FBQTtRQUNsQyxDQUFDLENBQUE7UUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztZQUMxQixXQUFXLEdBQUcsSUFBSSxDQUFBO1lBQ2xCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNULE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQTtRQUM1RCxDQUFDLENBQUE7UUFFRCxVQUFVLENBQUM7WUFDVCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUM7Z0JBQUMsTUFBTSxDQUFBO1lBQ3ZCLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxjQUFNLE9BQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFNBQVMsRUFBaEMsQ0FBZ0MsQ0FBQTtZQUU3RCxRQUFRLENBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO1FBQzVDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUVYLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ25DLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyJ9