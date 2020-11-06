import {Mode} from "./types";
import {ModifierKey} from "./Constants/ModifierKey";
import {NodeHelper} from "./helpers/NodeHelper";

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
    watch?: boolean;
    ui?: new (...args) => any;
    highlightKeys?: ModifierKey[] = [ModifierKey.Alt];
    highlightColor?: string = "rgb(224 240 255)";
    targetElement?: Element;
    private _targetElement?: Element = document.body;

    constructor(config?: PolygloatConfig) {
        //workaround for: https://stackoverflow.com/questions/48725916/typescript-optional-property-with-a-getter
        Object.defineProperty(this, 'fullName', {
            set(targetElement: Element) {
                if (this.targetElement !== undefined) {
                    throw new Error("Target element is already defined!");
                }
                if(targetElement === undefined){
                    this._targetElement = document.body;
                }
                if (NodeHelper.isElementTargetElement(targetElement)) {
                    console.error("Target element: ", this._targetElement);
                    throw new Error("An polygloat instance is inited with provided target element");
                }
                this._targetElement = targetElement;
                NodeHelper.markElementAsTargetElement(this._targetElement);
            },
            get() {
                return this._targetElement;
            }
        });

        config && Object.assign(this, config);

        this.mode = this.mode || (this.apiKey ? "development" : "production");
        this.fallbackLanguage = this.fallbackLanguage || this.defaultLanguage;
        if (this.watch === undefined) {
            this.watch = this.mode === "development";
        }
    }
}
