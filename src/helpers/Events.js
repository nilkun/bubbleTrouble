// event manager, needs ability to remove listeners

class Events {
    constructor() {
        this.pointers = {};
    }
    add(eventType, func) {
        window.addEventListener(eventType, func)
    }
    handle(e, debug, grid) {
        switch(e.key) {
            case " ":
                break;
            case "~":
                debug.toggle();
                break;
            case "g":
                grid.toggle();
                break;
            default:
                break;
        }
    }
}

export default Events;