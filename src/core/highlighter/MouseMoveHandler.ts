import {ElementWithMeta} from "../types";
import {ModifierKey} from "../../Constants/ModifierKey";
import {Lifecycle} from "tsyringe";
import {scoped} from "tsyringe";
import {Properties} from "../Properties";

@scoped(Lifecycle.ContainerScoped)
export class MouseMoveHandler {
    constructor(private properties: Properties) {
        this.initKeyListener();
    }

    private keysDown = new Set<ModifierKey>();
    private highlighted: ElementWithMeta;
    private mouseOn: ElementWithMeta;
    private mouseX: number;
    private mouseY: number;

    onMouseMove = (onClick: (e: MouseEvent) => void, e: MouseEvent, element: ElementWithMeta & ElementCSSInlineStyle): void => {
        if (this.mouseX === e.clientX && this.mouseY === e.clientY) {
            return;
        }
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        const clickListener = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation()
            onClick(e);
        };

        let initialBackgroundColor: string;

        const unhighlight = () => {
            element.style.backgroundColor = initialBackgroundColor;
            element.removeEventListener('click', clickListener);
            element.removeEventListener('mouseleave', leaveListener);
            window.removeEventListener('keydown', keyDownListener);
            window.removeEventListener('keyup', unhighlight);
        }

        const leaveListener = () => {
            unhighlight();
        };

        const keyDownListener = (e: Event) => {
            if (this.areKeysDown(...this.properties.config.highlightKeys)) {
                e.stopPropagation();
                e.preventDefault();
                highlight();
                window.addEventListener('keyup', unhighlight);
            }
        };

        const highlight = () => {
            if (this.highlighted && typeof this.highlighted._polygloat.removeHighlightListeners === "function") {
                this.highlighted._polygloat.removeHighlightListeners()
            }

            this.highlighted = element;
            initialBackgroundColor = element.style.backgroundColor;
            element.style.backgroundColor = this.properties.config.highlightColor;
            element.addEventListener('click', clickListener);
        };

        if (this.mouseOn && typeof this.mouseOn._polygloat.removeHighlightListeners === "function") {
            this.mouseOn._polygloat.removeHighlightListeners();
        }

        this.mouseOn = element;
        element._polygloat.removeHighlightListeners = unhighlight;

        window.addEventListener('keyup', unhighlight);

        if (this.areKeysDown(...this.properties.config.highlightKeys)) {
            e.stopPropagation();
            e.preventDefault();
            highlight();
        } else {
            window.addEventListener('keydown', keyDownListener);
        }

        element.addEventListener('mouseleave', leaveListener);
    };

    private initKeyListener() {
        window.addEventListener('blur', () => {
            this.keysDown = new Set();
        });

        window.addEventListener('keydown', (e) => {
            const modifierKey = ModifierKey[e.key];
            if (modifierKey !== undefined) {
                this.keysDown.add(modifierKey)
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keysDown.delete(ModifierKey[e.key])
        });
    }


    private areKeysDown(...keys: ModifierKey[]) {
        for (const key of keys) {
            if (!this.keysDown.has(key)) {
                return false;
            }
        }
        return true;
    }
}