import { Inject, Injectable, OnDestroy, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DefaultParamType,
  EventType,
  getTranslateProps,
  ListenerEvent,
  TFnType,
  TolgeeInstance,
  TranslationKey,
} from '@tolgee/web';
import { TOLGEE_INSTANCE } from './tolgee-instance-token';

@Injectable({ providedIn: 'root' })
export class TranslateService implements OnDestroy {
  private runPromise: Promise<void>;

  constructor(
    @Inject(TOLGEE_INSTANCE) private _tolgee: TolgeeInstance,
    private _ngZone: NgZone
  ) {}

  get tolgee() {
    return this._tolgee;
  }

  /**
   * Starts Tolgee if not started.
   *
   * The Tolgee is run outside NgZone. The triggered events, doesn't
   * trigger the change detection, when listening directly via Tolgee.on.
   *
   * However, all the emitting methods (on, translate, languageAsync)
   * in this class are emitting back in Angular's NgZone,
   * so the change detection works fine.
   */
  public async start(): Promise<void> {
    if (!this.isSSR()) {
      await this.runIfNotRunning();
    }
  }

  /**
   * Returns translation asynchronously, this method always return
   */
  readonly translate: TFnType<DefaultParamType, Observable<string>, TranslationKey> = (
    ...args
  ) => {
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

      const subscription = this.tolgee.on('update', translate)

      return () => {
        this.tolgee.removeActiveNs(params.ns);
        subscription.unsubscribe();
      };
    });
  };

  /**
   * Instantly returns translated value. May return undefined or outdated value.
   * Use only when you cannot use translate.
   */
  public readonly instant: TFnType<DefaultParamType, string, TranslationKey> = (...args) => {
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
   * It instantly emits current language
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
   * @param lang The new current language (e.g. en, en-US)
   * @return Promise<void> Resolves when translations
   * for given language are loaded
   */
  public changeLanguage(lang: string) {
    return this.tolgee.changeLanguage(lang);
  }

  /**
   * Returns observable emitting when specified event is triggered.
   *
   * It's a wrapper of Tolgee.on method. The emmit is triggered inside ngZone,
   * so change detection should work properly.
   *
   * @param event the event to listen
   */
  on<Event extends keyof EventType>(event: Event) {
    return new Observable<ListenerEvent<Event, EventType[Event]>>((subscriber) => {
      const subscription = this.tolgee.on(event, (value) => {
        this._ngZone.run(() => {
          subscriber.next(value as any);
        });
      });
      return () => subscription.unsubscribe();
    });
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
