import { Lifecycle, scoped } from 'tsyringe';
import { Properties } from '../Properties';
import { ApiHttpError } from '../Errors/ApiHttpError';
import { ArgumentTypes } from '../helpers/commonTypes';

type FetchArgumentTypes = ArgumentTypes<typeof fetch>;

type Tail<T extends any[]> = ((...args: T) => any) extends (
  _: infer First,
  ...rest: infer Rest
) => any
  ? T extends any[]
    ? Rest
    : ReadonlyArray<Rest[number]>
  : [];

@scoped(Lifecycle.ContainerScoped)
export class ApiHttpService {
  constructor(private properties: Properties) {}

  async fetch(...args: ArgumentTypes<typeof fetch>) {
    if (typeof args[0] === 'object') {
      return await fetch({ ...args[0], url: this.getUrl(args[0].url) }).then(
        (r) => ApiHttpService.handleErrors(r)
      );
    }
    const [url, ...rest] = args;
    return await fetch(this.getUrl(url), ...rest).then((r) =>
      ApiHttpService.handleErrors(r)
    );
  }

  async fetchJson(...args: ArgumentTypes<typeof fetch>) {
    return await this.fetch(...args).then((res) => {
      return res.json();
    });
  }

  async post(
    url,
    body,
    init: FetchArgumentTypes[1] = {},
    ...rest: Tail<Tail<FetchArgumentTypes>>
  ) {
    return await this.fetch(
      url,
      {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        ...init,
      },
      ...rest
    );
  }

  async postJson(
    url,
    body,
    init: FetchArgumentTypes[1] = {},
    ...rest: Tail<Tail<FetchArgumentTypes>>
  ) {
    return await this.post(url, body, init, ...rest).then((res) => res.json());
  }

  private static async handleErrors(response: Response) {
    if (response.status >= 400) {
      const error = new ApiHttpError(response);
      try {
        const data = await response.json();
        error.code = data.code;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Tolgee server responded with invalid status code.');
      }
      throw error;
    }
    return response;
  }

  private getUrl(path: string) {
    return `${this.properties.config.apiUrl}/uaa/${path}?ak=${this.properties.config.apiKey}`;
  }
}
