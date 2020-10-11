import {Mode} from "./Properties";

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
    filesUrlPrefix?: string;
    mode?: Mode;
    targetElement: Node = document.body;
    watch?: boolean;
}
