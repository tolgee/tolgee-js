import {
  ChangeDetectorRef,
  Inject,
  Injectable,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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

  constructor(
    @Inject(TOLGEE_INSTANCE) private _tolgee: TolgeeInstance,
    private _ngZone: NgZone
  ) {}

  get tolgee() {
    return this._tolgee;
  }

  /**
   * Starts Tolgee if not started and subscribes for languageChange and translationChange events
   */
  public async start(): Promise<void> {
    if (!this.runPromise) {
      this.runPromise = this._ngZone.runOutsideAngular(() => this.tolgee.run());
    }
    await this.runPromise;
  }

  ngOnDestroy(): void {
    this.tolgee.stop();
  }

  on<Event extends keyof EventType>(event: Event) {
    return new Observable<ListenerHandlerEvent<EventType[Event]>>(
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
   * Instantly returns translated value. May return undefined or outdated value.
   * Use only when you cannot use translate.
   */
  public readonly instant: TFnType = (...args) => {
    // @ts-ignore
    const params = getTranslateParams(...args);
    return this.tolgee.t(params);
  };

  /**
   * Returns translation asynchronously, this method always return
   */
  readonly translate: TFnType<DefaultParamType, Observable<string>> = (
    ...args
  ) => {
    // @ts-ignore
    const params = getTranslateParams(...args);
    return new Observable<string>((subscriber) => {
      const loadPromise = this.tolgee.addActiveNs(params.ns);
      const translate = async () => {
        await loadPromise;
        const translated = this.tolgee.t(params);
        this._ngZone.run(() => {
          subscriber.next(translated);
        });
      };

      // noinspection JSIgnoredPromiseFromCall
      translate();

      const subscription = this.tolgee
        .onKeyUpdate(translate)
        .subscribeKey({ key: params.key, ns: params.ns });

      return () => {
        this.tolgee.removeActiveNs(params.ns);
        subscription.unsubscribe();
      };
    });
  };
}
