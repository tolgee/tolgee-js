import {useWithStyles} from "./useWithStyles";
import * as React from "react";
import {FunctionComponent} from "react";

const css = `
.polygloat-button{
    border: 1px solid rgba(0, 0, 0, 0.23);
    color: rgba(0, 0, 0, 0.87);
    padding: 6px 16px;
    font-size: 0.875rem;
    min-width: 64px;
    box-sizing: border-box;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 500;
    line-height: 1.75;
    border-radius: 4px;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
    background-color: transparent;
    outline: 0;
    cursor: pointer;
}

.polygloat-button:disabled, .polygloat-button:disabled:hover{
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.23);
    color: rgba(0, 0, 0, 0.87);
}

.polygloat-button:hover{
    background-color: rgba(0, 0, 0, 0.04);
}

.polygloat-button-primary{
    color: #1976d2;
    border-color: rgba(25, 118, 210, 0.5);
}
.polygloat-button-primary:hover{
    border: 1px solid #1976d2;
    background-color: rgba(25, 118, 210, 0.04);
}

.polygloat-button-secondary {
    color: rgb(220, 0, 78);
    border: 1px solid rgba(220, 0, 78, 0.5);
}

.polygloat-button-secondary:hover {
    color: rgb(220, 0, 78);
    border: 1px solid rgba(220, 0, 78, 0.5);
}
`


type Variant = "primary" | "secondary" | "default"
type ButtonProps = React.ComponentProps<'button'> & { variant?: Variant };

export const Button: FunctionComponent<ButtonProps> = (props) => {
    useWithStyles(css);

    const variantClass = props.variant || props.variant === "default" ? `polygloat-button-${props.variant}` : "";
    return <button {...props} className={`polygloat-button ${variantClass}`}/>
}