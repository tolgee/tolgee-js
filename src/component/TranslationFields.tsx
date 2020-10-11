import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {TranslationDialogContext} from "./TranslationDialog";
import {CircularLoading} from "./CircularLoading";

export const TranslationFields: FunctionComponent = () => {
    let context = useContext(TranslationDialogContext);

    const style: React.CSSProperties = {
        margin: "10px 0 0 0",
        padding: "5px",
        border: "1px solid #ccc",
        width: "100%",
        borderRadius: "5px",
        fontStyle: "inherit",
        fontFamily: "inherit"
    };

    return <>
        {context.loading ? <div style={{textAlign: 'center'}}><CircularLoading/></div> :
            Object.keys(context.translations.translations).map(key =>
                <textarea
                    style={style}
                    disabled={context.editDisabled}
                    key={key}
                    id="filled-multiline-flexible"
                    placeholder={key}
                    value={context.translations.translations[key]}
                    onChange={context.onTranslationInputChange(key)}
                />)
        }
    </>
};