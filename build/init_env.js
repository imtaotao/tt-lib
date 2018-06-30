import { platform } from './utils';
function initBrowserAndElectron() {
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
    window.AudioContext =
        window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.msAudioContext;
}
export function initEnv() {
    if (platform.browser || platform.electron || platform.webpack) {
        initBrowserAndElectron();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdF9lbnYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5pdF9lbnYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUlsQztJQUNFLE1BQU0sQ0FBQyxxQkFBcUI7UUFDNUIsTUFBTSxDQUFDLHFCQUFxQjtZQUM1QixNQUFNLENBQUMsMkJBQTJCO1lBQ2xDLE1BQU0sQ0FBQyx3QkFBd0I7WUFDL0IsTUFBTSxDQUFDLHNCQUFzQjtZQUM3QixNQUFNLENBQUMsdUJBQXVCO1lBQzlCLFVBQVUsUUFBUTtnQkFDaEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQTtZQUMvQyxDQUFDLENBQUE7SUFFRCxNQUFNLENBQUMsb0JBQW9CO1FBQzNCLE1BQU0sQ0FBQyxvQkFBb0I7WUFDM0IsTUFBTSxDQUFDLDBCQUEwQjtZQUNqQyxNQUFNLENBQUMsdUJBQXVCO1lBQzlCLE1BQU0sQ0FBQyxxQkFBcUI7WUFDNUIsTUFBTSxDQUFDLHNCQUFzQjtZQUM3QixZQUFZLENBQUE7SUFFWixNQUFNLENBQUMsWUFBWTtRQUNuQixNQUFNLENBQUMsWUFBWTtZQUNuQixNQUFNLENBQUMsa0JBQWtCO1lBQ3pCLE1BQU0sQ0FBQyxlQUFlO1lBQ3RCLE1BQU0sQ0FBQyxjQUFjLENBQUE7QUFDdkIsQ0FBQztBQUVELE1BQU07SUFDSixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDOUQsc0JBQXNCLEVBQUUsQ0FBQTtJQUMxQixDQUFDO0FBQ0gsQ0FBQyJ9