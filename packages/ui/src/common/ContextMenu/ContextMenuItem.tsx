import * as React from 'react';
import {FunctionComponent} from "react";
import {useWithStyles} from "../useWithStyles";

const CLASS_NAME = "_polygloat-menu-item";

export const ContextMenuItem: FunctionComponent<React.ComponentProps<"div">> = (props) => {
    const hoverBackgroundColor = "rgba(0,93,255, 0.05)";

    useWithStyles(`
        .${CLASS_NAME}{
            cursor: pointer;
            padding: 10px;
        }
        .${CLASS_NAME}:hover{
            background-color: ${hoverBackgroundColor};
        }
    `)

    return (
        <div className={CLASS_NAME} {...props} />
    )
};