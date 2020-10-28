import {UI} from "polygloat/ui";
import {Mode} from "./Types";
import {ModifierKey} from "../Constants/ModifierKey";

export class PolygloatConfig {
    tagAttributes?: { [key: string]: string[] } = {
        'textarea': ['placeholder'],
        'input': ['value', 'placeholder']
    };
    restrictedElements?: string[] = ['script', 'style'];
    defaultLanguage?: string = 'en';
    fallbackLanguage?: string;
    inputPrefix?: string = '%-%polygloat:';
    inputSuffix?: string = '%-%';
    apiUrl?: string;
    apiKey?: string;
    filesUrlPrefix?: string = "i18n/";
    mode?: Mode;
    targetElement?: Element = document.body;
    watch?: boolean;
    ui?: typeof UI;
    highlightKeys?: ModifierKey[] = [ModifierKey.Alt];
    highlightColor?: string = "rgb(224 240 255)";

    constructor(config?: PolygloatConfig) {
        config && Object.assign(this, config);
        this.mode = this.mode || (this.apiKey ? "development" : "production");
        this.fallbackLanguage = this.fallbackLanguage || this.defaultLanguage;
        if (this.watch === undefined) {
            this.watch = this.mode === "development";
        }
    }
}
