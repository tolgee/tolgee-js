import {PolygloatConfig} from './PolygloatConfig';
import {Lifecycle, scoped} from 'tsyringe';
import {Scope} from "./Types";

@scoped(Lifecycle.ContainerScoped)
export class Properties {
    config: PolygloatConfig;
    currentLanguage: string;
    scopes: Scope[] = [];

    set preferredLanguages(languages: Set<string>) {
        localStorage.setItem("__polygloat_preferredLanguages", JSON.stringify(Array.from(languages)));
    }

    get preferredLanguages(): Set<string> {
        return new Set(JSON.parse(localStorage.getItem("__polygloat_preferredLanguages")));
    }
}

