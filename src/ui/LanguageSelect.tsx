import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {TranslationDialogContext} from "./TranslationDialog";
import MultiSelect from "react-multi-select-component";
import {CircularLoading} from "./CircularLoading";

export const LanguageSelect: FunctionComponent = () => {
    const context = useContext(TranslationDialogContext);

    if (context.availableLanguages === undefined) {
        return <CircularLoading/>;
    }

    const options = [...context.availableLanguages].map((name) => ({label: name, value: name}));
    const selected = options.filter(o => context.selectedLanguages.has(o.value));
    const onChange = (values: { value: string, label: string }[]) => {
        context.onSelectedLanguagesChange(new Set(values.map(o => o.value)));
    };

    return <>
        {context.availableLanguages &&
        <MultiSelect
            disableSearch={context.availableLanguages.size < 10}
            options={options}
            value={selected}
            onChange={onChange}
            labelledBy={"Choose languages"}
            hasSelectAll={false}
            valueRenderer={(o) => {
                return o.map(o => o.value).join(", ");
            }
            }
        />
        }
    </>
};