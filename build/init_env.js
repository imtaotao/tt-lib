import { platform } from './utils';
function initRequsetAnimation() {
    window.requestAnimationFrame =
        window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
    window.cancelAnimationFrame =
        window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            clearTimeout;
}
export function initEnv() {
    if (platform.browser || platform.electron) {
        initRequsetAnimation();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdF9lbnYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5pdF9lbnYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUVsQztJQUNFLE1BQU0sQ0FBQyxxQkFBcUI7UUFDdEIsTUFBTyxDQUFDLHFCQUFxQjtZQUM3QixNQUFPLENBQUMsMkJBQTJCO1lBQ25DLE1BQU8sQ0FBQyx3QkFBd0I7WUFDaEMsTUFBTyxDQUFDLHNCQUFzQjtZQUM5QixNQUFPLENBQUMsdUJBQXVCO1lBQ3JDLFVBQVUsUUFBUTtnQkFDaEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQTtZQUMvQyxDQUFDLENBQUE7SUFFRCxNQUFNLENBQUMsb0JBQW9CO1FBQ3JCLE1BQU8sQ0FBQyxvQkFBb0I7WUFDNUIsTUFBTyxDQUFDLDBCQUEwQjtZQUNsQyxNQUFPLENBQUMsdUJBQXVCO1lBQy9CLE1BQU8sQ0FBQyxxQkFBcUI7WUFDN0IsTUFBTyxDQUFDLHNCQUFzQjtZQUNwQyxZQUFZLENBQUE7QUFDZCxDQUFDO0FBRUQsTUFBTTtJQUNKLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDMUMsb0JBQW9CLEVBQUUsQ0FBQTtJQUN4QixDQUFDO0FBQ0gsQ0FBQyJ9