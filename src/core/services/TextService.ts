import {Lifecycle, scoped} from "tsyringe";
import {KeyAndParams, TranslatedWithMetadata, TranslationParams} from "../Types";
import {TranslationService} from "./TranslationService";
import {Properties} from "../Properties";

export type ReplacedType = { newValue: string, keysAndParams: KeyAndParams[] } | false;

@scoped(Lifecycle.ContainerScoped)
export class TextService {
    constructor(private properties: Properties, private translationService: TranslationService) {
    }

    async replace(text: string): Promise<ReplacedType> {
        //create virtual text to replace multiple text siblings in it
        const translatedPromises: Promise<TranslatedWithMetadata | string>[] = [];
        const matchRegexp = new RegExp("(.*?)" + this.rawUnWrapRegex, "gs");
        let matched = false;
        const rest = text.replace(matchRegexp, (_, g0: string, g1: string) => {
            if (g0 !== "") {
                translatedPromises.push(new Promise(resolve => resolve(g0)));
            }
            translatedPromises.push(this.getTranslatedWithMetadata(g1));
            matched = true;
            return "";
        });
        const translated = await Promise.all(translatedPromises);

        const keysAndParams: KeyAndParams[] = []
        const newValue = translated.map(t => {
            if (typeof t === "string") {
                return t;
            }
            keysAndParams.push({key: t.key, params: t.params});
            return t.translated;
        }).join() + rest;

        if (matched) {
            return {newValue, keysAndParams};
        }

        return false;
    }

    private async getTranslatedWithMetadata(text: string): Promise<TranslatedWithMetadata> {
        const {key, params} = TextService.parseUnwrapped(text);
        const translated = await this.translate(key, params);
        return {translated, key: key, params}
    }

    private static parseUnwrapped(unWrappedString: string): KeyAndParams {
        const strings = unWrappedString.match(/(?:[^\\,:\n]|\\.)+/g);
        const result = {key: strings.shift(), params: {}};

        while (strings.length) {
            const [name, value] = strings.splice(0, 2);
            result.params[name] = value;
        }
        return result;
    }

    readonly replaceParams = (translation: string, params: TranslationParams): string => {
        let result = translation;
        const regExp = (name) => new RegExp("\\{\\{\\s*" + this.escapeRegExp(name) + "\\s*\\}\\}");
        Object.entries(params).forEach(([name, value]) =>
            //replace all unescaped param template fields (the regex is this complicated because of lookbehinds)
            result = result.replace(regExp(name), value));
        return result;
    };

    readonly escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    };

    get unWrapRegex() {
        return new RegExp(this.rawUnWrapRegex, 'gm');
    }

    get rawUnWrapRegex(): string {
        return `${this.escapeRegExp(this.properties.config.inputPrefix)}(.*?)${this.escapeRegExp(this.properties.config.inputSuffix)}`;
    }


    async translate(input: string, params: TranslationParams, lang = this.properties.currentLanguage) {
        return this.replaceParams(await this.translationService.getTranslation(input, lang), params)
    }

    instant(input: string, params: TranslationParams, lang = this.properties.currentLanguage, orEmpty?) {
        return this.replaceParams(this.translationService.getFromCacheOrFallback(input, lang, orEmpty), params);
    }

    public wrap(inputText: string, params: TranslationParams = {}): string {
        let paramString = Object.entries(params).map(([name, value]) => `${this.escapeParam(name)}:${this.escapeParam(value)}`).join(",");
        paramString = paramString.length ? `:${paramString}` : "";
        return `${this.properties.config.inputPrefix}${this.escapeParam(inputText)}${paramString}${this.properties.config.inputSuffix}`;
    }

    private readonly escapeParam = (string: string) => string.replace(",", "\\,").replace(":", "\\:");
}