import {UI} from "polygloat/ui";
import {Mode} from "./Types";

export class PolygloatConfig {
    noWrapIn?: ["textarea"];
    tagAttributes?: { [key: string]: string[] } = {
        'textarea': ['placeholder'],
        'input': ['value', 'placeholder']
    };
    restrictedElements?: string[] = ['script', 'style'];
    defaultLanguage?: string = 'en';
    inputPrefix?: string = '%-%polygloat:';
    inputSuffix?: string = '%-%';
    apiUrl?: string;
    apiKey?: string;
    filesUrlPrefix?: string = "i18n/";
    mode?: Mode;
    targetElement?: Element = document.body;
    watch?: boolean;
    ui?: typeof UI;

    constructor(config?: PolygloatConfig) {
        config && Object.assign(this, config);
        this.mode = this.mode || (this.apiKey ? "development" : "production");
        if (this.watch === undefined) {
            this.watch = this.mode === "development";
        }
    }
}
