import { Properties } from '../Properties';
import { Messages } from './Messages';
import { EventService } from '../services/EventService';
import { ElementRegistrar } from '../services/ElementRegistrar';
import { TolgeeConfig } from '../TolgeeConfig';

export class PluginManager {
  private handshakeSucceed = false;

  constructor(
    private messages: Messages,
    private properties: Properties,
    private eventService: EventService,
    private elementRegistrar: ElementRegistrar
  ) {}

  run() {
    try {
      this.messages.startListening();
      this.handshake();
      this.initOnRegisterKeyEmit();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
      // eslint-disable-next-line no-console
      console.warn(
        'Can not start communication with browser plugin. Check waning above.'
      );
    }
  }

  initOnRegisterKeyEmit() {
    this.eventService.ELEMENT_REGISTERED.subscribe((element) => {
      element._tolgee.nodes.forEach((node) => {
        node._tolgee.keys.forEach((key) => this.messages.send('NEW_KEY', key));
      });
    });
  }

  stop() {
    this.messages.stopListening();
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
      this.initListeners();
    });
  };

  private initListeners() {
    this.messages.listenPopup('HIGHLIGHT_KEY', (key: string) => {
      for (const element of this.elementRegistrar.findAllByKey(key)) {
        element._tolgee.highlight();
      }
    });

    this.messages.listenPopup('UNHIGHLIGHT_KEY', (key: string) => {
      for (const element of this.elementRegistrar.findAllByKey(key)) {
        element._tolgee.unhighlight();
      }
    });
  }
}
