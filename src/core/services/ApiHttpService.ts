import {Lifecycle, scoped} from "tsyringe";
import {Properties} from "../Properties";
import {ApiHttpError} from "../Errors/ApiHttpError";
import {ArgumentTypes} from "../helpers/commonTypes";


@scoped(Lifecycle.ContainerScoped)
export class ApiHttpService {
    constructor(private properties: Properties) {
    }

    async fetch(...args: ArgumentTypes<typeof fetch>) {
        if (typeof args[0] === "object") {
            return await fetch({...args[0], url: this.getUrl(args[0].url)}).then(r => ApiHttpService.handleErrors(r));
        }
        const [url, ...rest] = args;
        return await fetch(this.getUrl(url), ...rest).then(r => ApiHttpService.handleErrors(r));
    }

    async fetchJson(...args: ArgumentTypes<typeof fetch>) {
        return await this.fetch(...args).then(res => {
            return res.json()
        });
    }

    private static async handleErrors(response: Response) {
        if (response.status >= 400) {
            throw new ApiHttpError(response);
        }
        return response;
    }

    private getUrl(path: string) {
        return `${this.properties.config.apiUrl}/uaa/${path}?ak=${this.properties.config.apiKey}`;
    }
}