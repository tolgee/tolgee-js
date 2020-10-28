import * as React from 'react';
import {FunctionComponent, useEffect, useState} from 'react';
import {RESTRICTED_ASCENDANT_ATTRIBUTE} from "../../../Constants/Global";

const CONTEXT_MENU_ID = "_polygloat-context-menu";

export interface ContextMenuProps {
    openEvent: MouseEvent;
    onClose: () => void;
}

export const ContextMenu: FunctionComponent<ContextMenuProps> = (props) => {
    const [width, setWidth] = useState(null);

    const computeLeft = () => {
        if (width === null) {
            return 0;
        }
        if (props.openEvent.clientX + width < document.body.clientWidth) {
            return props.openEvent.clientX;
        }
        return props.openEvent.clientX - width;
    }

    const top = (width !== null) ? props.openEvent.clientY : -9999;
    const left = computeLeft();
    const ref = React.createRef<HTMLDivElement>();

    useEffect(() => {
        if (ref.current !== null) {
            setWidth(ref.current.clientWidth);
        }
    }, [ref.current]);

    useEffect(() => {
        document.addEventListener("click", props.onClose);
        return () => {
            document.removeEventListener("click", props.onClose);
        }
    }, [props.onClose]);

    const style: React.CSSProperties = {
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        width: width !== null ? `${width + 1}px` : undefined,
        border: "1px solid #A3A3A3",
        backgroundColor: "white",
        borderRadius: "3px"
    }

    return (
        <>
            <div style={style}
                 id={CONTEXT_MENU_ID}
                 ref={ref}
                 onClick={e => e.stopPropagation()}
                 {...{[RESTRICTED_ASCENDANT_ATTRIBUTE]: "true"}}>
                {props.children}
            </div>
        </>
    )
};