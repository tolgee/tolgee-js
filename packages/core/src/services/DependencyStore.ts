import { Properties } from '../Properties';
import { EventService } from './EventService';
import { ApiHttpService } from './ApiHttpService';
import { TranslationService } from './TranslationService';
import { TextService } from './TextService';
import { MouseEventHandler } from '../highlighter/MouseEventHandler';
import { TranslationHighlighter } from '../highlighter/TranslationHighlighter';
import { ElementRegistrar } from './ElementRegistrar';
import { TextHandler } from '../handlers/TextHandler';
import { AttributeHandler } from '../handlers/AttributeHandler';
import { CoreHandler } from '../handlers/CoreHandler';
import { Observer } from '../Observer';
import { CoreService } from './CoreService';
import { TolgeeConfig } from '../TolgeeConfig';
import { WrappedHandler } from '../handlers/WrappedHandler';
import { PluginManager } from '../toolsManager/PluginManager';
import { Messages } from '../toolsManager/Messages';
import { HighlightFunctionsInitializer } from '../highlighter/HighlightFunctionsInitializer';
import { ScreenshotService } from './ScreenshotService';

export class DependencyStore {
  public properties: Properties = new Properties();
  public eventService: EventService = new EventService();
  public apiHttpService: ApiHttpService = new ApiHttpService(this.properties);
  public mouseEventHandler = new MouseEventHandler(this.properties);
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
    this.translationService
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

  public textHandler = new TextHandler(
    this.properties,
    this.translationHighlighter,
    this.textService,
    this.elementRegistrar
  );
  public attributeHandler = new AttributeHandler(
    this.properties,
    this.textService,
    this.elementRegistrar,
    this.translationHighlighter
  );

  public wrappedHandler = new WrappedHandler(
    this.properties,
    this.translationHighlighter,
    this.textService,
    this.elementRegistrar
  );

  public coreHandler: CoreHandler = new CoreHandler(
    this.coreService,
    this.textHandler,
    this.eventService,
    this.properties,
    this.attributeHandler,
    this.textService,
    this.wrappedHandler
  );
  public observer: Observer = new Observer(
    this.properties,
    this.coreHandler,
    this.textHandler,
    this.attributeHandler,
    this.elementRegistrar
  );

  public messages: Messages = new Messages();

  public pluginManager: PluginManager = new PluginManager(
    this.messages,
    this.properties,
    this.eventService,
    this.elementRegistrar,
    this.translationService
  );

  constructor(config: TolgeeConfig = new TolgeeConfig()) {
    this.properties.config = config;
    this.translationService.initStatic();
    this.translationHighlighter.pluginManager = this.pluginManager;
  }
}
