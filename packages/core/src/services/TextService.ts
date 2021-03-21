import {Lifecycle, scoped} from "tsyringe";
import {KeyAndParams, TranslatedWithMetadata, TranslationParams} from "../types";
import {TranslationService} from "./TranslationService";
import {Properties} from "../Properties";
import {TextHelper} from "../helpers/TextHelper";
import IntlMessageFormat from 'intl-messageformat'

export type ReplacedType = { text: string, keys: KeyAndParams[] };

@scoped(Lifecycle.ContainerScoped)
export class TextService {
    constructor(private properties: Properties, private translationService: TranslationService) {
    }

    async translate(key: string, params: TranslationParams, lang = this.properties.currentLanguage) {
        return this.format(await this.translationService.getTranslation(key, lang), params)
    }

    instant(key: string, params: TranslationParams, lang = this.properties.currentLanguage, orEmpty?) {
        return this.format(this.translationService.getFromCacheOrFallback(key, lang, orEmpty), params);
    }

    async replace(text: string): Promise<ReplacedType> {
        const matchRegexp = new RegExp(this.rawUnWrapRegex, "gs");

        await this.translationService.loadTranslations();

        const keysAndParams: KeyAndParams[] = []

        let matched = false;
        const translated = text.replace(matchRegexp, (_, pre: string, wrapped: string, unwrapped: string, position: number) => {
            if (pre === "\\") {
                if (!TextHelper.isCharEscaped(position, text)) {
                    return pre + wrapped;
                }
            }
            const translated = this.getTranslatedWithMetadata(unwrapped);
            keysAndParams.push({key: translated.key, params: translated.params});
            matched = true;
            return pre + translated.translated;
        });

        const withoutEscapes = TextHelper.removeEscapes(translated);

        if (matched) {
            return {text: withoutEscapes, keys: keysAndParams};
        }

        return undefined;
    }

    public wrap(key: string, params: TranslationParams = {}): string {
        let paramString = Object.entries(params).map(([name, value]) => `${this.escapeParam(name)}:${this.escapeParam(value as string)}`).join(",");
        paramString = paramString.length ? `:${paramString}` : "";
        return `${this.properties.config.inputPrefix}${this.escapeParam(key)}${paramString}${this.properties.config.inputSuffix}`;
    }

    private getTranslatedWithMetadata(text: string): TranslatedWithMetadata {
        const {key, params} = TextService.parseUnwrapped(text);
        const translated = this.instant(key, params, undefined, false);
        return {translated, key: key, params}
    }

    private static parseUnwrapped(unWrappedString: string): KeyAndParams {
        const strings = unWrappedString.match(/(?:[^\\,:\n]|\\.)+/g);
        const result = {key: TextHelper.removeEscapes(strings.shift()), params: {}};

        while (strings.length) {
            const [name, value] = strings.splice(0, 2);
            result.params[name] = value;
        }
        return result;
    }

    private readonly format = (translation: string, params: TranslationParams): string => {
        try {
            return new IntlMessageFormat(translation, this.properties.currentLanguage).format(params) as string;
        } catch (e) {
            if (e.code === "MISSING_VALUE") {
                console.warn(e.message);
                return e.translation;
            }
        }
    };

    private readonly escapeForRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    private get rawUnWrapRegex(): string {
        const escapedPrefix = this.escapeForRegExp(this.properties.config.inputPrefix);
        const escapedSuffix = this.escapeForRegExp(this.properties.config.inputSuffix);
        return `(\\\\?)(${escapedPrefix}(.*?)${escapedSuffix})`;
    }

    private readonly escapeParam = (string: string) => string.replace(/[,:\\]/gs, "\\$&");
}