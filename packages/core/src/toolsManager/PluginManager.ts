import { Properties } from '../Properties';
import { Messages } from './Messages';
import { EventService } from '../services/EventService';
import { ElementRegistrar } from '../services/ElementRegistrar';
import { TolgeeConfig } from '../TolgeeConfig';
import { TranslationService } from '../services/TranslationService';
import { TranslationData } from '../types/DTOs';
import { sleep } from '../helpers/sleep';

export class PluginManager {
  public handshakeSucceed = false;

  constructor(
    private messages: Messages,
    private properties: Properties,
    private eventService: EventService,
    private elementRegistrar: ElementRegistrar,
    private translationService: TranslationService
  ) {}

  run() {
    try {
      this.messages.startListening();
      this.handshake();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
      // eslint-disable-next-line no-console
      console.warn(
        'Can not start communication with browser plugin. Check waning above.'
      );
    }
  }

  stop() {
    this.messages.stopListening();
  }

  public readonly takeScreenshot = (
    translationData: TranslationData
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.translationService
        .changeTranslations(translationData)
        .then(async (revertChange) => {
          try {
            this.highlightAllByKey(translationData.key);
            await sleep(100);
            this.messages.send('TOLGEE_TAKE_SCREENSHOT');
            const cancel = this.messages.listen(
              'TOLGEE_SCREENSHOT_TAKEN',
              (data) => {
                this.unhighlightAllByKey(translationData.key);
                resolve(data);
                revertChange();
                cancel();
              }
            );
          } catch (e) {
            revertChange();
            reject(e);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  private highlightAllByKey(key: string) {
    this.elementRegistrar
      .findAllByKey(key)
      .forEach((el) => el._tolgee.highlight());
  }

  private unhighlightAllByKey(key: string) {
    this.elementRegistrar
      .findAllByKey(key)
      .forEach((el) => el._tolgee.unhighlight());
  }

  private readonly handshake = () => {
    const sharedConfiguration: Partial<Properties> & {
      config: Partial<TolgeeConfig>;
    } = {
      ...this.properties,
      config: {
        ...this.properties.config,
        //remove properties, which cannot be sent by window.postMessage
        staticData: undefined,
        targetElement: undefined,
        _targetElement: undefined,
        ui: undefined,
      } as any as TolgeeConfig,
    };
    this.messages.send('TOLGEE_READY', sharedConfiguration);
    this.messages.listen('TOLGEE_PLUGIN_READY', () => {
      this.handshakeSucceed = true;
      this.messages.send('TOLGEE_READY', sharedConfiguration);
    });
  };
}
