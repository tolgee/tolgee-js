import {Lifecycle, scoped} from "tsyringe";
import {Translations} from "../types";
import {TranslationData} from "../DTOs/TranslationData";
import {Properties} from "../Properties";
import {CoreService} from "./CoreService";
import {ApiHttpService} from "./ApiHttpService";
import {TextHelper} from "../helpers/TextHelper";
import {ApiHttpError} from "../Errors/ApiHttpError";

@scoped(Lifecycle.ContainerScoped)
export class TranslationService {
    private translationsCache: Map<string, Translations> = new Map<string, Translations>();
    private fetchPromises: Promise<any>[] = [];

    constructor(private properties: Properties, private coreService: CoreService, private apiHttpService: ApiHttpService) {
    }

    async loadTranslations(lang: string = this.properties.currentLanguage) {
        if (this.translationsCache.get(lang) == undefined) {
            if (!(this.fetchPromises[lang] instanceof Promise)) {
                this.fetchPromises[lang] = this.fetchTranslations(lang);
            }
            await this.fetchPromises[lang];
        }
        this.fetchPromises[lang] = undefined;
    }

    async getTranslation(name: string, lang: string = this.properties.currentLanguage): Promise<string> {
        if (!this.getFromCache(name, lang)) {
            await this.loadTranslations(lang);
        }
        return this.getFromCacheOrFallback(name, lang);
    }

    async setTranslations(translationData: TranslationData) {
        this.coreService.checkScope("translations.edit");

        await this.apiHttpService.post('', translationData);

        Object.keys(translationData.translations).forEach(lang => {
            if (this.translationsCache.get(lang)) { // if the language is not loaded, then ignore the change
                const path = TextHelper.splitOnNonEscapedDelimiter(translationData.key, ".");
                let root: string | Translations = this.translationsCache.get(lang);
                for (let i = 0; i < path.length; i++) {
                    let item = path[i];
                    if (root[item] === undefined) {
                        root[item] = {};
                    }
                    if (i === (path.length - 1)) {
                        root[item] = translationData.translations[lang];
                        return;
                    }
                    root = root[item];
                }
            }
        });
    }

    getFromCacheOrFallback(name: string, lang: string = this.properties.currentLanguage, orEmpty: boolean = false): string {
        const translatedText = this.getFromCache(name, lang) || this.getFromCache(name, this.properties.config.fallbackLanguage);

        if (translatedText) {
            return translatedText;
        }

        if (orEmpty) {
            return "";
        }
        const path = TextHelper.splitOnNonEscapedDelimiter(name, ".");
        return path[path.length - 1];
    }

    getTranslationsOfKey = async (key: string, languages: Set<string> = new Set([this.properties.currentLanguage])): Promise<TranslationData> => {
        this.coreService.checkScope("translations.view");
        try {
            let data = await this.apiHttpService.postJson(`keyTranslations/${Array.from(languages).join(",")}`, {key});
            return new TranslationData(key, data);
        } catch (e) {
            if (e instanceof ApiHttpError) {
                //only possible option of this error is, that languages definition is changed, but the old value is stored in preferred languages
                if (e.response.status === 404) {
                    if (e.code === "language_not_found") {
                        this.properties.preferredLanguages = await this.coreService.getLanguages();
                        console.error("Requested language not found, refreshing the page!");
                        location.reload();
                        return;
                    }
                }
            }
            throw e;
        }
    };


    private async fetchTranslations(lang: string) {
        if (this.properties.config.mode === "development") {
            return await this.fetchTranslationsDevelopment(lang);
        }
        return await this.fetchTranslationsProduction(lang);
    }

    private async fetchTranslationsProduction(lang: string) {
        let result = await fetch(`${this.properties.config.filesUrlPrefix || "/"}${lang}.json`);
        if (result.status >= 400) {
            //on error set language data as empty object to not break the flow
            this.translationsCache.set(lang, {});
            return;
        }
        let data = (await result.json());
        this.translationsCache.set(lang, data);
    }

    private async fetchTranslationsDevelopment(lang: string) {
        this.coreService.checkScope("translations.view");
        try {
            let data = await this.apiHttpService.fetchJson(`${lang}`);
            this.translationsCache.set(lang, data[lang] || {});
        } catch (e) {
            console.error(e);
            this.translationsCache.set(lang, {});
            return;
        }
    }

    private getFromCache(name: string, lang: string = this.properties.currentLanguage): string {
        const path = TextHelper.splitOnNonEscapedDelimiter(name, ".");
        let root: string | Translations = this.translationsCache.get(lang);

        //if lang is not downloaded or does not exist at all
        if (root === undefined) {
            return undefined;
        }

        for (const item of path) {
            if (root[item] === undefined) {
                return undefined;
            }
            root = root[item];
        }
        return root as string;
    }
}