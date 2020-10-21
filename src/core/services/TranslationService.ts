import {Lifecycle, scoped} from "tsyringe";
import {Translations} from "../Types";
import {TranslationData} from "../DTOs/TranslationData";
import {Properties} from "../Properties";
import {CoreService} from "./CoreService";
import {ApiHttpService} from "./ApiHttpService";

@scoped(Lifecycle.ContainerScoped)
export class TranslationService {
    private translationsCache: Map<string, Translations> = new Map<string, Translations>();
    private fetchPromises: Promise<any>[] = [];

    constructor(private properties: Properties, private coreService: CoreService, private apiHttpService: ApiHttpService) {
    }

    async getTranslations(lang: string) {
        if (this.translationsCache.get(lang) == undefined) {
            if (!(this.fetchPromises[lang] instanceof Promise)) {
                this.fetchPromises[lang] = this.fetchTranslations(lang);
            }
            await this.fetchPromises[lang];
        }
        this.fetchPromises[lang] = undefined;
        return this.translationsCache.get(lang);
    }

    async fetchTranslationsProduction(lang: string) {
        let requestResult = await fetch(`${this.properties.config.filesUrlPrefix || "/"}${lang}.json`);
        if (requestResult.status >= 400) {
            //on error set language data as empty object to not break the flow
            this.translationsCache.set(lang, {});
            return;
        }
        let data = (await requestResult.json());
        this.translationsCache.set(lang, data);
    }


    async fetchTranslations(lang: string) {
        if (this.properties.config.mode === "development") {
            return await this.fetchTranslationsDevelopment(lang);
        }
        return await this.fetchTranslationsProduction(lang);
    }

    async fetchTranslationsDevelopment(lang: string) {
        this.coreService.checkScope("translations.view");
        let requestResult = await this.apiHttpService.fetch(`${lang}`);

        if (requestResult.status >= 400) {
            //on error set language data as empty object to not break the flow
            this.translationsCache.set(lang, {});
            return;
        }

        let data = (await requestResult.json());
        this.translationsCache.set(lang, data[lang] || {});
    }

    async getTranslation(name: string, lang: string = this.properties.currentLanguage): Promise<string> {
        await this.getTranslations(lang);
        if (lang !== this.properties.config.defaultLanguage && !this.getFromCache(name, lang)) {
            await this.getTranslations(this.properties.config.defaultLanguage);
            return this.getFromCacheOrFallback(name, this.properties.config.defaultLanguage);
        }
        return this.getFromCacheOrFallback(name, lang);
    }

    private getFromCache(name: string, lang: string = this.properties.currentLanguage): string {
        const path = name.split('.');
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


    getFromCacheOrFallback(name: string, lang: string = this.properties.currentLanguage, orEmpty: boolean = false): string {
        return this.getFromCache(name, lang) || this.getFromCache(name, this.properties.config.defaultLanguage) || (orEmpty ? "" : name);
    }

    getSourceTranslations = async (sourceText: string, languages: Set<string> = new Set([this.properties.currentLanguage])): Promise<TranslationData> => {
        this.coreService.checkScope("translations.view");
        let response = await this.apiHttpService.fetch(`source/${sourceText}/${Array.from(languages).join(",")}`);
        let data = await response.json();

        if (response.status === 404) {
            if (data.code && data.code === "language_not_found") {
                this.properties.preferredLanguages = new Set(await this.coreService.getLanguages());
                console.error("Requested language not found, refreshing the page!");
                location.reload();
            }
        }

        return new TranslationData(sourceText, data);
    };

    async setTranslations(translationData: TranslationData) {
        this.coreService.checkScope("translations.edit");

        let response = await this.apiHttpService.fetch(``, {
            body: JSON.stringify(translationData),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.status != 200) {
            throw new Error("Server responded with error status code");
        }

        Object.keys(translationData.translations).forEach(lang => {
            if (this.translationsCache.get(lang)) {
                const path = translationData.sourceFullPath.split('.');
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
}