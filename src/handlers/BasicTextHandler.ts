import {NodeHelper} from '../helpers/NodeHelper';
import {PolygloatData, PolygloatSimpleSpanElement} from '../Types';
import {PolygloatService} from '../services/polygloatService';
import {Properties} from '../Properties';
import {container, injectable} from 'tsyringe';
import {TranslationHighlighter} from '../TranslationHighlighter';
import {PluginManager} from "../toolsManager/PluginManager";

@injectable()
export class BasicTextHandler {
    private properties: Properties = container.resolve(Properties);
    private service: PolygloatService = container.resolve(PolygloatService);
    private highlighter: TranslationHighlighter = container.resolve(TranslationHighlighter);

    constructor(private pluginManager: PluginManager) {
    }

    async refresh(node: Element) {
        const data = (node as PolygloatSimpleSpanElement).__polygloat;
        node.innerHTML = await this.service.translate(data.input, data.params, this.properties.currentLanguage);
    }

    async handleNewNode(node: Element): Promise<void> {
        let xPathResult = document.evaluate(`./text()[contains(.,'${this.properties.config.inputPrefix}')]`, node, null, XPathResult.ANY_TYPE);

        for (const element of NodeHelper.nodeListToArray(xPathResult)) {

            //create virtual element to replace multiple text siblings in it
            const nodePromises: Promise<PolygloatSimpleSpanElement | Text>[] = [];

            const matchRegexp = new RegExp("(.*?)" + this.service.rawUnWrapRegex, "gs");

            let matched = false;
            const rest = element.textContent.replace(matchRegexp, (_, g0, g1) => {
                if (g0 !== "") {
                    nodePromises.push(new Promise(resolve => resolve(document.createTextNode(g0))));
                }
                nodePromises.push(this.createSpan(this.service.parseUnwrapped(g1)));
                matched = true;
                return "";
            });

            //do not replace, when nothing is found
            if (matched) {
                element.replaceWith(...await Promise.all(nodePromises), rest);
            }
        }
    }

    readonly createSpan = async (data: PolygloatData): Promise<PolygloatSimpleSpanElement> => {
        const span: PolygloatSimpleSpanElement = document.createElement("span") as PolygloatSimpleSpanElement;
        span.setAttribute("_polygloat", "");

        this.addPolygloatToPrototype(span);

        span.__polygloat = {...data};
        let translation = await this.service.getTranslation(data.input, this.properties.currentLanguage);
        span.innerHTML = this.service.replaceParams(translation, data.params);

        this.highlighter.listen(span);
        this.pluginManager.registerSpan(span);
        return span;
    };

    private addPolygloatToPrototype(span) {
        let spanPrototype = Object.getPrototypeOf(span);
        spanPrototype.__polygloat = {};
    }
}
