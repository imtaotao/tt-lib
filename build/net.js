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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL25ldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFFdEQsTUFBTSxnQkFBaUIsR0FBVSxFQUFFLE9BSWxDO0lBQ0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLG9EQUFnRCxPQUFPLEdBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUN2RyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07UUFDM0IsSUFBQSxrQkFJVyxFQUhiLFlBQVMsRUFBVCw4QkFBUyxFQUNULGVBQWUsRUFBZixvQ0FBZSxFQUNmLG9CQUFtQyxFQUFuQyx3REFBbUMsQ0FDdEI7UUFFakIsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUMvQyxJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQTtRQUUxQyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDdkIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFBO1FBRVosSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUc7Z0JBQ3JCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDNUIsR0FBRyxJQUFJLE1BQUksR0FBRyxTQUFJLElBQUksQ0FBQyxHQUFHLENBQUcsQ0FBQTtpQkFDOUI7YUFDRjtTQUNGO2FBQU07WUFDTCxHQUFHLEdBQUcsSUFBSSxDQUFBO1NBQ1g7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUE7UUFDN0IsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLFdBQVcsR0FBRyxZQUFZLEdBQUcsR0FBRyxDQUFBO1FBRTFELE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxVQUFDLE1BQVU7WUFDaEMsV0FBVyxHQUFHLElBQUksQ0FBQTtZQUNsQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDZixNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsU0FBUyxDQUFBO1FBQ2xDLENBQUMsQ0FBQTtRQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO1lBQzFCLFdBQVcsR0FBRyxJQUFJLENBQUE7WUFDbEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ1QsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFBO1FBQzVELENBQUMsQ0FBQTtRQUVELFVBQVUsQ0FBQztZQUNULElBQUksV0FBVztnQkFBRSxPQUFNO1lBQ3ZCLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxjQUFNLE9BQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFNBQVMsRUFBaEMsQ0FBZ0MsQ0FBQTtZQUU3RCxRQUFRLENBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO1FBQzVDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUVYLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ25DLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyJ9