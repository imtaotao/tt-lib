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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdF9lbnYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5pdF9lbnYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUlsQztJQUNFLE1BQU0sQ0FBQyxxQkFBcUI7UUFDNUIsTUFBTSxDQUFDLHFCQUFxQjtZQUM1QixNQUFNLENBQUMsMkJBQTJCO1lBQ2xDLE1BQU0sQ0FBQyx3QkFBd0I7WUFDL0IsTUFBTSxDQUFDLHNCQUFzQjtZQUM3QixNQUFNLENBQUMsdUJBQXVCO1lBQzlCLFVBQVUsUUFBUTtnQkFDaEIsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUE7WUFDL0MsQ0FBQyxDQUFBO0lBRUQsTUFBTSxDQUFDLG9CQUFvQjtRQUMzQixNQUFNLENBQUMsb0JBQW9CO1lBQzNCLE1BQU0sQ0FBQywwQkFBMEI7WUFDakMsTUFBTSxDQUFDLHVCQUF1QjtZQUM5QixNQUFNLENBQUMscUJBQXFCO1lBQzVCLE1BQU0sQ0FBQyxzQkFBc0I7WUFDN0IsWUFBWSxDQUFBO0lBRVosTUFBTSxDQUFDLFlBQVk7UUFDbkIsTUFBTSxDQUFDLFlBQVk7WUFDbkIsTUFBTSxDQUFDLGtCQUFrQjtZQUN6QixNQUFNLENBQUMsZUFBZTtZQUN0QixNQUFNLENBQUMsY0FBYyxDQUFBO0FBQ3ZCLENBQUM7QUFFRCxNQUFNO0lBQ0osSUFBSSxRQUFRLENBQUMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUM3RCxzQkFBc0IsRUFBRSxDQUFBO0tBQ3pCO0FBQ0gsQ0FBQyJ9