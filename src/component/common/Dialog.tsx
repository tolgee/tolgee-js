import * as React from 'react';
import {FunctionComponent} from 'react';

interface DialogProps {
    open: boolean,
    onClose: () => void,
    style: React.CSSProperties
}

const backdropStyle: React.CSSProperties = {
    position: "absolute",
    width: "100vw",
    height: "100vh",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}

const dialogStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "20px"
}

export const Dialog: FunctionComponent<DialogProps> = (props) => {

    function onKeyDown(key: string) {
        if (key === "Escape") {
            props.onClose();
        }
    }

    return (
        <>
            {
                props.open &&
                <div style={backdropStyle} onClick={props.onClose} onKeyDown={(e) => onKeyDown(e.key)}>
                    <div style={{...dialogStyle, ...props.style}} onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}>
                        {props.children}
                    </div>
                </div>
            }
        </>
    );
}