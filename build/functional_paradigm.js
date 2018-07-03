import { logError } from './utils';
export function curry(fun) {
    if (!Function) {
        logError('FP', "[ fun ] must be a \"function\", but now is " + typeof fun);
    }
    return function () {
        var catchArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            catchArgs[_i] = arguments[_i];
        }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return fun.apply(void 0, catchArgs.concat(args));
        };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25hbF9wYXJhZGlnbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9mdW5jdGlvbmFsX3BhcmFkaWdtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQWMsTUFBTSxTQUFTLENBQUE7QUFFOUMsTUFBTSxnQkFBaUIsR0FBWTtJQUNqQyxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ2IsUUFBUSxDQUFDLElBQUksRUFBRSxnREFBNEMsT0FBTyxHQUFLLENBQUMsQ0FBQTtLQUN6RTtJQUVELE9BQU87UUFBQyxtQkFBWTthQUFaLFVBQVksRUFBWixxQkFBWSxFQUFaLElBQVk7WUFBWiw4QkFBWTs7UUFBSyxPQUFBO1lBQUMsY0FBTztpQkFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO2dCQUFQLHlCQUFPOztZQUFLLE9BQUEsR0FBRyxlQUFJLFNBQVMsUUFBSyxJQUFJO1FBQXpCLENBQTBCO0lBQXZDLENBQXVDLENBQUE7QUFDbEUsQ0FBQyJ9