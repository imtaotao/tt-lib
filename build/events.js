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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL2V2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFFeEQ7SUFJRSxvQkFBb0IsSUFBVztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQTtRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtJQUNwQixDQUFDO0lBRU0sdUJBQUUsR0FBVCxVQUFXLElBQWE7UUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFBRSxRQUFRLENBQUMsT0FBTyxFQUFFLG9EQUFvRCxFQUFFLElBQUksQ0FBQyxDQUFBO1FBRXBHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFTSx5QkFBSSxHQUFYLFVBQWEsSUFBYTtRQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUFFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsb0RBQW9ELEVBQUUsSUFBSSxDQUFDLENBQUE7UUFFcEcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVNLHlCQUFJLEdBQVgsVUFBYSxJQUFTO1FBQ2QsSUFBQSxTQUErQixFQUE3QiwwQkFBVSxFQUFFLHNCQUFRLENBQVM7UUFDckMsSUFBTSxLQUFLLEdBQUcsRUFBRSxJQUFJLE1BQUEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1FBRXZDLEtBQWtCLFVBQVUsRUFBVix5QkFBVSxFQUFWLHdCQUFVLEVBQVYsSUFBVSxFQUFFO1lBQXpCLElBQU0sR0FBRyxtQkFBQTtZQUNaLEdBQUcsQ0FBQyxLQUFLLENB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