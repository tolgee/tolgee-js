import {TolgeeConfig} from './TolgeeConfig';
import {Lifecycle, scoped} from 'tsyringe';
import {Scope} from "./types";

const PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY = "__tolgee_preferredLanguages";
const CURRENT_LANGUAGE_LOCAL_STORAGE_KEY = "__tolgee_currentLanguage";

@scoped(Lifecycle.ContainerScoped)
export class Properties {
    config: TolgeeConfig;
    scopes: Scope[] = [];

    set preferredLanguages(languages: Set<string>) {
        localStorage.setItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY, JSON.stringify(Array.from(languages)));
    }

    get preferredLanguages(): Set<string> {
        return new Set(JSON.parse(localStorage.getItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY)));
    }

    set currentLanguage(language: string) {
        localStorage.setItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY, language);
    }

    get currentLanguage(): string {
        let result = localStorage.getItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY);
        if (!result) {
            result = this.getLanguageByNavigator();
            this.currentLanguage = result
        }
        return result;
    }

    private getLanguageByNavigator() {
        if (window) {
            const preferred = window.navigator.language
            const exactMatch = this.config.availableLanguages.find(l => l === preferred);
            if (exactMatch) {
                return exactMatch;
            }

            const getTwoLetters = (fullTag) => fullTag.replace(/^(.+?)(-.*)?$/, "$1")

            const preferredTwoLetter = getTwoLetters(window.navigator.language);
            const twoLetterMatch = this.config.availableLanguages.find(l => getTwoLetters(l) === preferredTwoLetter);
            if (twoLetterMatch) {
                return twoLetterMatch;
            }
        }

        return this.config.defaultLanguage;
    }
}

