import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DefaultParamType,
  EventType,
  getTranslateParams,
  ListenerHandlerEvent,
  TFnType,
  TolgeeInstance,
} from '@tolgee/web';
import { TOLGEE_INSTANCE } from './tolgee-instance-token';

@Injectable({ providedIn: 'root' })
export class TranslateService implements OnDestroy {
  private runPromise: Promise<void>;

  constructor(@Inject(TOLGEE_INSTANCE) private _tolgee: TolgeeInstance) {}

  get tolgee() {
    return this._tolgee;
  }

  /**
   * Starts Tolgee if not started and subscribes for languageChange and translationChange events
   */
  public async start(): Promise<void> {
    if (!this.runPromise) {
      this.runPromise = this.tolgee.run();
    }
    await this.runPromise;
  }

  ngOnDestroy(): void {
    // stop it!
    this.tolgee.stop();
  }

  on<Event extends keyof EventType>(event: Event) {
    return new Observable<ListenerHandlerEvent<EventType[Event]>>(
      (subscriber) => {
        const subscription = this.tolgee.on(event, (value) => {
          subscriber.next(value as any);
        });
        return () => {
          subscription.unsubscribe;
        };
      }
    );
  }

  language: Observable<string> = new Observable((subscriber) => {
    subscriber.next(this.tolgee.getLanguage());
    const subscription = this.on('language').subscribe((value) => {
      subscriber.next(value.value);
    });

    return () => subscription.unsubscribe();
  });

  /**
   * Changes the current language
   * @param lang The new current language (e.g. en, en-US)
   * @return Promise<void> Resolves when translations
   * for given language are loaded
   */
  public setLang(lang: string) {
    return this.tolgee.changeLanguage(lang);
  }

  public readonly instant: TFnType = (...args) => {
    // @ts-ignore
    const params = getTranslateParams(...args);
    return this.tolgee.t(params);
  };

  readonly translate: TFnType<DefaultParamType, Observable<string>> = (
    ...args
  ) => {
    // @ts-ignore
    const params = getTranslateParams(...args);
    return new Observable<string>((subscriber) => {
      const translate = async () => {
        const translated = this.tolgee.t(params);
        subscriber.next(translated);
      };

      // noinspection JSIgnoredPromiseFromCall
      translate();

      const subscription = this.tolgee
        .onKeyUpdate(translate)
        .subscribeKey({ key: params.key, ns: params.ns });

      return () => {
        subscription.unsubscribe();
      };
    });
  };
}
