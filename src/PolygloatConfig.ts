import {Mode} from "./types";
import {ModifierKey} from "./Constants/ModifierKey";
import {NodeHelper} from "./helpers/NodeHelper";

const DEFAULT_TARGET_ELEMENT = document.body;

export class PolygloatConfig {
    tagAttributes?: { [key: string]: string[] } = {
        'textarea': ['placeholder'],
        'input': ['value', 'placeholder']
    };
    passToParent?: (keyof HTMLElementTagNameMap)[] | ((node: Element) => boolean) = ["option", "optgroup"];
    restrictedElements?: string[] = ['script', 'style'];
    defaultLanguage?: string = 'en';
    fallbackLanguage?: string;
    availableLanguages?: string[] = ['en'];
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
    private _targetElement?: Element;

    constructor(config?: PolygloatConfig) {
        //workaround for: https://stackoverflow.com/questions/48725916/typescript-optional-property-with-a-getter
        Object.defineProperty(this, 'targetElement', {
            set(targetElement: Element) {
                if (this.targetElement !== undefined) {
                    throw new Error("Target element is already defined!");
                }
                if (targetElement === undefined) {
                    this._targetElement = DEFAULT_TARGET_ELEMENT;
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

        Object.assign(this, config || {});
        if (this._targetElement === undefined) {
            this._targetElement = DEFAULT_TARGET_ELEMENT;
        }
        this.mode = this.mode || (this.apiKey ? "development" : "production");
        this.fallbackLanguage = this.fallbackLanguage || this.defaultLanguage;
        if (this.watch === undefined) {
            this.watch = this.mode === "development";
        }
    }
}
