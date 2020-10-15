import {Mode} from "./Properties";
import {UI} from "polygloat/ui";

export class PolygloatConfig {
    tagAttributes?: { [key: string]: string[] } = {
        'textarea': ['placeholder'],
        'input': ['value', 'placeholder']
    };
    restrictedElements?: string[] = ['script', 'style'];
    defaultLanguage?: string = 'en';
    inputPrefix?: string = '%-%polygloat:';
    inputPostfix?: string = '%-%';
    apiUrl?: string;
    apiKey?: string;
    filesUrlPrefix?: string = "i18n/";
    mode?: Mode;
    targetElement?: Node = document.body;
    watch?: boolean;
    ui?: typeof UI;


    constructor(config?: PolygloatConfig) {
        debugger;
        config && Object.assign(this, config);
        this.mode = this.mode || (this.apiKey ? "development" : "production");
        if (this.watch === undefined) {
            this.watch = this.mode === "development";
        }
    }
}
