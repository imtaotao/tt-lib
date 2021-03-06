import { isString, isFunction, logError } from './utils';
var EventQueue = (function () {
    function EventQueue(type) {
        this.type = type;
        this.commonFuns = [];
        this.onceFuns = [];
    }
    EventQueue.prototype.on = function (func) {
        if (!isFunction(func))
            logError('Event', "[ registered callback function ] is not a function", true);
        this.commonFuns.push(func);
    };
    EventQueue.prototype.once = function (func) {
        if (!isFunction(func))
            logError('Event', "[ registered callback function ] is not a function", true);
        this.onceFuns.push(func);
    };
    EventQueue.prototype.emit = function (data) {
        var _a = this, commonFuns = _a.commonFuns, onceFuns = _a.onceFuns;
        var event = { data: data, type: this.type };
        for (var _i = 0, commonFuns_1 = commonFuns; _i < commonFuns_1.length; _i++) {
            var fun = commonFuns_1[_i];
            fun(event);
        }
        for (var i = 0; i < onceFuns.length; i++) {
            onceFuns[i](event);
            onceFuns.splice(i, 1);
            i--;
        }
    };
    EventQueue.prototype.emitCommon = function (data) {
        var commonFuns = this.commonFuns;
        for (var _i = 0, commonFuns_2 = commonFuns; _i < commonFuns_2.length; _i++) {
            var fun = commonFuns_2[_i];
            fun({
                type: this.type,
                data: data,
            });
        }
    };
    EventQueue.prototype.emitOnce = function (data) {
        var onceFuns = this.onceFuns;
        for (var i = 0; i < onceFuns.length; i++) {
            onceFuns[i]({
                type: this.type,
                data: data,
            });
            onceFuns.splice(i, 1);
            i--;
        }
    };
    EventQueue.prototype.remove = function (func, keyWord) {
        if (!func) {
            this.commonFuns = [];
            this.onceFuns = [];
            return;
        }
        if (!isFunction(func))
            logError('Event', "[ " + func + " ] is not a function", true);
        if (keyWord && keyWord !== 'common' && keyWord !== 'once') {
            logError('Event', "[ keyWord ] must be a \"common\" or \"once\", But now is " + keyWord, true);
        }
        var _a = this, commonFuns = _a.commonFuns, onceFuns = _a.onceFuns;
        if (!keyWord || keyWord === 'common') {
            for (var i = 0; i < commonFuns.length; i++) {
                if (commonFuns[i] === func) {
                    commonFuns.splice(i, 1);
                    i--;
                }
            }
        }
        if (!keyWord || keyWord === 'once') {
            for (var j = 0; j < onceFuns.length; j++) {
                if (onceFuns[j] === func) {
                    onceFuns.splice(j, 1);
                    j--;
                }
            }
        }
    };
    EventQueue.prototype.removeCommon = function () {
        this.commonFuns = [];
    };
    EventQueue.prototype.removeOnce = function () {
        this.onceFuns = [];
    };
    return EventQueue;
}());
var Event = (function () {
    function Event() {
    }
    Event.prototype.create = function (type) {
        if (!isString(type))
            logError('Event', "[ event name ] is not a string", true);
        if (this[type])
            logError('Event', 'The current queue already exists. Please do not create it again');
        this[type] = new EventQueue(type);
        return this;
    };
    return Event;
}());
export { Event };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL2V2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFFeEQ7SUFJRSxvQkFBb0IsSUFBVztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQTtRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtJQUNwQixDQUFDO0lBRU0sdUJBQUUsR0FBVCxVQUFXLElBQWE7UUFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBQyxRQUFRLENBQUMsT0FBTyxFQUFFLG9EQUFvRCxFQUFFLElBQUksQ0FBQyxDQUFBO1FBRXBHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFTSx5QkFBSSxHQUFYLFVBQWEsSUFBYTtRQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsb0RBQW9ELEVBQUUsSUFBSSxDQUFDLENBQUE7UUFFcEcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVNLHlCQUFJLEdBQVgsVUFBYSxJQUFTO1FBQ2QsSUFBQSxTQUErQixFQUE3QiwwQkFBVSxFQUFFLHNCQUFRLENBQVM7UUFDckMsSUFBTSxLQUFLLEdBQUcsRUFBRSxJQUFJLE1BQUEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1FBRXZDLEdBQUcsQ0FBQyxDQUFjLFVBQVUsRUFBVix5QkFBVSxFQUFWLHdCQUFVLEVBQVYsSUFBVTtZQUF2QixJQUFN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