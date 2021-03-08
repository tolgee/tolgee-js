import {NodeHelper} from '../helpers/NodeHelper';
import {Properties} from '../Properties';
import {Lifecycle, scoped} from 'tsyringe';
import {TranslationHighlighter} from '../highlighter/TranslationHighlighter';
import {TextService} from "../services/TextService";
import {AbstractHandler} from "./AbstractHandler";
import {ElementRegistrar} from "../services/ElementRegistrar";


@scoped(Lifecycle.ContainerScoped)
export class TextHandler extends AbstractHandler {
    constructor(protected properties: Properties,
                protected translationHighlighter: TranslationHighlighter,
                protected textService: TextService,
                protected nodeRegistrar: ElementRegistrar
    ) {
        super(properties, textService, nodeRegistrar, translationHighlighter);
    }

    async handle(node: Node): Promise<void> {
        let inputPrefix = this.properties.config.inputPrefix;
        let inputSuffix = this.properties.config.inputSuffix;

        let xPath = `./descendant-or-self::text()[contains(., '${inputPrefix}') and contains(., '${inputSuffix}')]`;
        let nodes = NodeHelper.evaluate(xPath, node);
        let filtered: Text[] = this.filterRestricted(nodes as Text[]);

        await this.handleNodes(filtered);
    }
}
