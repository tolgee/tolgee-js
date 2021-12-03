import { Properties } from '../Properties';
import { EventService } from './EventService';
import { ApiHttpService } from './ApiHttpService';
import { TranslationService } from './TranslationService';
import { TextService } from './TextService';
import { MouseEventHandler } from '../highlighter/MouseEventHandler';
import { TranslationHighlighter } from '../highlighter/TranslationHighlighter';
import { ElementRegistrar } from './ElementRegistrar';
import { Observer } from '../Observer';
import { CoreService } from './CoreService';
import { TolgeeConfig } from '../TolgeeConfig';
import { PluginManager } from '../toolsManager/PluginManager';
import { Messages } from '../toolsManager/Messages';
import { HighlightFunctionsInitializer } from '../highlighter/HighlightFunctionsInitializer';
import { ScreenshotService } from './ScreenshotService';
import { ModuleService } from './ModuleService';
import { TextWrapper } from '../wrappers/text/TextWrapper';
import { NodeHelper } from '../helpers/NodeHelper';
import { AbstractWrapper } from '../wrappers/AbstractWrapper';
import { InvisibleWrapper } from '../wrappers/invisible/InvisibleWrapper';

export class DependencyService {
  public properties: Properties = new Properties();
  public eventService: EventService = new EventService();
  public apiHttpService: ApiHttpService = new ApiHttpService(this.properties);
  public mouseEventHandler = new MouseEventHandler(this.properties);
  public moduleService = new ModuleService();
  public coreService: CoreService = new CoreService(
    this.properties,
    this.apiHttpService
  );
  public screenshotService = new ScreenshotService(
    this.coreService,
    this.apiHttpService
  );
  public translationService: TranslationService = new TranslationService(
    this.properties,
    this.coreService,
    this.apiHttpService,
    this.eventService
  );
  public textService: TextService = new TextService(
    this.properties,
    this.translationService,
    this.moduleService
  );

  public highlightFunctionInitializer = new HighlightFunctionsInitializer(
    this.properties
  );

  public translationHighlighter = new TranslationHighlighter(this);

  public elementRegistrar: ElementRegistrar = new ElementRegistrar(
    this.properties,
    this.translationHighlighter,
    this.eventService
  );

  public messages: Messages = new Messages();

  public pluginManager: PluginManager = new PluginManager(
    this.messages,
    this.properties,
    this.eventService,
    this.elementRegistrar,
    this.translationService
  );

  constructor() {
    this.translationHighlighter.pluginManager = this.pluginManager;
  }

  public wrapper: AbstractWrapper;
  public observer: Observer;

  init(config: TolgeeConfig) {
    if (this.properties.config) {
      throw new Error('Duplicate initialization of config');
    }
    this.properties.config = new TolgeeConfig(config);
    if (this.properties.config.wrapperMode === 'invisible') {
      this.wrapper = new InvisibleWrapper(
        this.properties,
        this.elementRegistrar
      );
    } else {
      this.wrapper = new TextWrapper(
        this.eventService,
        this.properties,
        this.textService,
        this.elementRegistrar
      );
    }

    this.observer = new Observer(
      this.properties,
      this.wrapper,
      this.elementRegistrar
    );
    this.translationService.initStatic();
  }

  run = () => {
    this.mouseEventHandler.run();
  };

  stop = () => {
    this.observer.stopObserving();
    this.elementRegistrar.cleanAll();
    NodeHelper.unmarkElementAsTargetElement(
      this.properties.config.targetElement
    );
  };
}
