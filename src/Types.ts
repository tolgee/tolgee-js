export interface PolygloatTextInputElement extends HTMLElement {
    __polygloat: TextInputElementData;
    selectionStart: number;
    value: string;
}

export interface PolygloatTextAreaElement extends PolygloatTextInputElement, HTMLTextAreaElement {
    addEventListener: any;
    removeEventListener: any;
}

export interface PolygloatInputElement extends PolygloatTextInputElement, HTMLInputElement {
    addEventListener: any;
    removeEventListener: any;
}

export interface TextInputElementData {
    oldValue: string;
    valueInputs: string[];
    touched: boolean;
    oldPlaceholder: string;
    placeholderInputs: string[];
}

export type Translations = { [key: string]: string | Translations };
export type TranslationParams = { [key: string]: string }
export type PolygloatData = { input: string, params: TranslationParams }

export interface SimpleSpanElementData {
    input: string;
    params?: TranslationParams;
}

export interface PolygloatSimpleSpanElement extends HTMLSpanElement {
    __polygloat: SimpleSpanElementData;
}

export interface PolygloatInWindow {
    registered?: Element[];
    pluginReady?: () => void;
}

export type PgDocument = Document & { __polygloat?: PolygloatInWindow, __polygloatPlugin: { registerToPlugin?: () => void } }