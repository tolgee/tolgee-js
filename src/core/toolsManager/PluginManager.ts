import {Lifecycle, scoped} from "tsyringe";
import {Messages} from "./Messages";
import {PolygloatSimpleSpanElement} from "../Types";
import {Properties} from "../Properties";

@scoped(Lifecycle.ContainerScoped)
export class PluginManager {
    private handshakeSucceed = false;
    private spans: { [key: number]: PolygloatSimpleSpanElement } = {};
    private counter = 0;

    constructor(private messages: Messages, private properties: Properties) {
    }

    run() {
        try {
            this.messages.startListening();
            this.handshake();
        } catch (e) {
            console.warn(e);
            console.warn("Can not start communication with browser plugin. Check waning above.")
        }
    }

    readonly handshake = () => {
        this.messages.send("POLYGLOAT_READY");
        this.messages.listen("POLYGLOAT_PLUGIN_READY", () => {
            this.handshakeSucceed = true;
            this.messages.send("POLYGLOAT_READY", {...this.properties, config: {...this.properties.config, targetElement: undefined}} as Properties);
            this.initListeners();
        });
    };

    readonly registerSpan = (span: PolygloatSimpleSpanElement) => {
        const n = this.counter++;
        this.spans[n] = span;
        this.messages.send("NEW_SPAN", {data: span.__polygloat, n});
    };

    private initListeners() {
        this.messages.listenPopup("HIGHLIGHT_SPAN", (num: number) => {
            console.log(this.spans, num);
            this.spans[num].style.backgroundColor = "yellow";
        });

        this.messages.listenPopup("UNHIGHLIGHT_SPAN", (num: number) => {
            console.log(this.spans, num);
            this.spans[num].style.backgroundColor = null;
        });
    }

    stop() {
        this.messages.stopListening();
    }
}