import {Properties} from '../Properties';
import {Lifecycle, scoped} from 'tsyringe';
import {ApiHttpService} from "./ApiHttpService";
import {Scope} from "../types";

@scoped(Lifecycle.ContainerScoped)
export class CoreService {
    private languagePromise: Promise<string[]>;

    constructor(private properties: Properties, private apiHttpService: ApiHttpService) {
    }

    async getLanguages(): Promise<Set<string>> {
        if (!(this.languagePromise instanceof Promise)) {
            this.languagePromise = this.apiHttpService.fetchJson(`languages`);
        }

        const languages = new Set(await this.languagePromise);
        this.properties.preferredLanguages = new Set<string>(Array.from(this.properties.preferredLanguages).filter(l => languages.has(l)));
        return languages;
    }

    async getScopes() {
        try {
            return await this.apiHttpService.fetchJson(`scopes`);
        } catch (e) {
            console.error(e);
            console.error("Error getting scopes. Trying to switch to production mode!");
            this.properties.config.mode = "production";
        }
    }


    isAuthorizedTo(scope: Scope) {
        return this.properties.scopes.indexOf(scope) > -1;
    }

    checkScope(scope: Scope) {
        if (!this.isAuthorizedTo(scope)) {
            throw new Error("Api key not permitted to do this, please add 'translations.view' scope.");
        }
    }
}

