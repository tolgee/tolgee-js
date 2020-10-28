import {PolygloatConfig} from './PolygloatConfig';
import {Lifecycle, scoped} from 'tsyringe';
import {Scope} from "./Types";

const PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY = "__polygloat_preferredLanguages";

@scoped(Lifecycle.ContainerScoped)
export class Properties {
    config: PolygloatConfig;
    currentLanguage: string;
    scopes: Scope[] = [];

    set preferredLanguages(languages: Set<string>) {
        localStorage.setItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY, JSON.stringify(Array.from(languages)));
    }

    get preferredLanguages(): Set<string> {
        return new Set(JSON.parse(localStorage.getItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY)));
    }
}

