import {Lifecycle, scoped} from "tsyringe";

type Listener = {
    type: string
    callback: (data) => void
};

type Message = {
    data: any,
    type: string
}

type PgEvent = {
    data: Message
} & MessageEvent;

@scoped(Lifecycle.ContainerScoped)
export class Messages {
    private listeners: Listener[] = [];
    private listenersPopup: Listener[] = [];
    private _stopListening: () => void;

    readonly startListening = () => {
        const receiveMessage = (event: PgEvent) => {
            if (event.source != window) {
                return;
            }
            this.listeners.forEach(listener => {
                if (listener.type == event.data.type) {
                    listener.callback(event.data.data);
                }
            });
        };

        window.addEventListener("message", receiveMessage, false);

        typeof this._stopListening === "function" && this._stopListening();
        this._stopListening = () => {
            window.removeEventListener("message", receiveMessage, false);
        }

        this.startPopupListening();
    };

    public stopListening() {
        this._stopListening();
    }

    readonly startPopupListening = () => {
        this.listen("POPUP_TO_LIB", (data: Message) => {
            this.listenersPopup.forEach(listener => {
                if (data.type == listener.type) {
                    listener.callback(data.data);
                }
            });
        });
    };

    readonly listenPopup = (type: string, callback: (data) => void) => {
        this.listenersPopup.push({type, callback});
    };


    readonly listen = (type: string, callback: (data) => void) => {
        this.listeners.push({type, callback});
    };

    readonly send = (type: string, data?: any) => {
        try {
            window.postMessage({type, data}, window.origin);
        } catch (e) {
            console.warn("Can not send message.", e);
        }
    };
}