import { Injectable, OnDestroy, NgZone, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CombinedOptions,
  DefaultParamType,
  EventType,
  getTranslateProps,
  ListenerEvent,
  TFnType,
  TolgeeInstance,
  TranslateProps,
  TranslationKey,
} from '@tolgee/web';
import { TOLGEE_INSTANCE } from './tolgee-instance-token';

@Injectable({ providedIn: 'root' })
export class TranslateService implements OnDestroy {
  private runPromise: Promise<void>;
  private readonly _ngZone = inject(NgZone);

  readonly #tolgeeOrPromise = inject(TOLGEE_INSTANCE);
  #resolvedTolgee: TolgeeInstance | Promise<TolgeeInstance> | undefined;

  get tolgee(): TolgeeInstance {
    if (this.#resolvedTolgee) {
      // If it's still a promise, throw error
      if (this.#resolvedTolgee instanceof Promise) {
        throw new Error(
          'Tolgee instance is not yet resolved. Call start() first or wait for app initialization.'
        );
      }
      return this.#resolvedTolgee;
    }

    // If it's a promise, this is a synchronous access before resolution
    if (this.#tolgeeOrPromise instanceof Promise) {
      throw new Error(
        'Tolgee instance is not yet resolved. Call start() first or wait for app initialization.'
      );
    }

    this.#resolvedTolgee = this.#tolgeeOrPromise;
    return this.#resolvedTolgee;
  }

  /**
   * Starts Tolgee if not started.
   *
   * The Tolgee is run outside NgZone. The triggered events don't
   * trigger the change the detection when listening directly via Tolgee.on.
   *
   * However, all the emitting methods (on, translate, languageAsync)
   * in this class are emitting back in Angular's NgZone,
   * so the change detection works fine.
   */
  public async start(): Promise<void> {
    // If tolgee was provided as a promise, resolve it first
    if (!this.#resolvedTolgee) {
      if (this.#tolgeeOrPromise instanceof Promise) {
        // Assign the promise immediately to prevent redundant awaits
        this.#resolvedTolgee = this.#tolgeeOrPromise;
      } else {
        // Eagerly cache the resolved instance
        this.#resolvedTolgee = this.#tolgeeOrPromise;
      }
    }

    // Await resolution if it's a promise
    if (this.#resolvedTolgee instanceof Promise) {
      this.#resolvedTolgee = await this.#resolvedTolgee;
    }

    if (!this.isSSR()) {
      await this.runIfNotRunning();
    }
  }

  translate(props: TranslateProps): Observable<string>;
  translate(
    key: TranslationKey,
    options?: CombinedOptions<string>
  ): Observable<string>;
  translate(
    key: TranslationKey,
    defaultValue?: string,
    options?: CombinedOptions<string>
  ): Observable<string>;
  /**
   * Returns translation asynchronously, this method always returns
   */
  translate(...args: any[]): Observable<string> {
    // @ts-ignore
    const params = getTranslateProps(...args);
    return new Observable<string>((subscriber) => {
      const loadPromise = this.tolgee.addActiveNs(params.ns);
      const translate = async () => {
        await loadPromise;
        const translated = this.tolgee.t(params);
        subscriber.next(translated);
      };

      // noinspection JSIgnoredPromiseFromCall
      translate();

      const subscription = this.tolgee.on('update', translate);

      return () => {
        this.tolgee.removeActiveNs(params.ns);
        subscription.unsubscribe();
      };
    });
  }

  /**
   * Instantly returns a translated value. May return undefined or outdated value.
   * Use only when you cannot use translate pipe.
   */
  public readonly instant: TFnType<DefaultParamType, string, TranslationKey> = (
    ...args
  ) => {
    // @ts-ignore
    const params = getTranslateProps(...args);
    return this.tolgee.t(params);
  };

  /**
   * Returns current language
   */
  get language(): string {
    return this.tolgee.getLanguage();
  }

  /**
   * Returns an observable emitting current language.
   * It instantly emits the current language
   */
  get languageAsync(): Observable<string> {
    return new Observable((subscriber) => {
      subscriber.next(this.tolgee.getLanguage());
      const subscription = this.on('language').subscribe((value) => {
        subscriber.next(value.value);
      });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * Changes the current language
   * @param lang The new current language (e.g., en, en-US)
   * @return Promise<void> Resolves when translations
   * for given language are loaded
   */
  public changeLanguage(lang: string) {
    return this.tolgee.changeLanguage(lang);
  }

  /**
   * Returns observable emitting when a specified event is triggered.
   *
   * It's a wrapper of Tolgee. 'on' method. The emmit is triggered inside ngZone,
   * so change detection should work properly.
   *
   * @param event the event to listen
   */
  on<Event extends keyof EventType>(event: Event) {
    return new Observable<ListenerEvent<Event, EventType[Event]>>(
      (subscriber) => {
        const subscription = this.tolgee.on(event, (value) => {
          this._ngZone.run(() => {
            subscriber.next(value as any);
          });
        });
        return () => subscription.unsubscribe();
      }
    );
  }

  ngOnDestroy(): void {
    this.tolgee.stop();
  }

  private async runIfNotRunning() {
    if (!this.runPromise) {
      this.runPromise = this._ngZone.runOutsideAngular(() => {
        return this.tolgee.run();
      });
    }
    await this.runPromise;
  }

  private isSSR() {
    return typeof window === 'undefined';
  }
}
