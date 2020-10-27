import * as React from "react";
import {FunctionComponent, useEffect, useState} from "react";
import {TranslationData} from "../core/DTOs/TranslationData";
import TranslationDialogInner from "./TranslatonDialogInner";
import {ComponentDependencies} from "./PolygloatViewer";

type DialogProps = {
    input: string,
    open: boolean,
    onClose: () => void,
    dependencies: ComponentDependencies
}

export type DialogContextType = {
        loading: boolean,
        saving: boolean,
        error: string
        success: boolean,
        availableLanguages: Set<string>,
        selectedLanguages: Set<string>,
        onSelectedLanguagesChange: (val: Set<string>) => void,
        editDisabled: boolean,
        onTranslationInputChange: (abbr) => (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
        translations: TranslationData,
        onSave: () => void
    }
    & DialogProps

export const TranslationDialogContext = React.createContext<DialogContextType>(undefined);

export const TranslationDialog: FunctionComponent<DialogProps> = (props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const [translations, setTranslations] = useState<TranslationData>(null);
    const coreService = props.dependencies.coreService;
    const properties = props.dependencies.properties;
    const translationService = props.dependencies.translationService;

    const onTranslationInputChange = (abbr) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSuccess(false);
        translations.translations[abbr] = event.target.value;
        setTranslations({...translations});
    };

    const loadTranslations = (languages?: Set<string>) => {
        translationService.getTranslationsOfKey(props.input, languages).then(result => {
            setTranslations(result);
            setLoading(false);
        });
    }

    useEffect(() => {
        if (props.open) {
            setLoading(true);
            setSuccess(false);
            setError(null);
            loadTranslations(properties.preferredLanguages);
            if (availableLanguages === undefined) {
                coreService.getLanguages().then(l => {
                    setAvailableLanguages(l);
                });
            }
        }
    }, [props.open]);

    const onSave = async () => {
        setSaving(true);
        try {
            setSaving(true);
            await translationService.setTranslations(translations);
            await props.dependencies.eventService.TRANSLATION_CHANGED.emit(translations);
            setSuccess(true);
            await new Promise((resolve => setTimeout(resolve, 500)));
            setError(null);
            props.onClose();
        } catch (e) {
            setError("Unexpected error occurred :(");
            throw e;
        } finally {
            setSaving(false);
        }
    };

    const editDisabled = loading || !coreService.isAuthorizedTo("translations.edit");

    const [availableLanguages, setAvailableLanguages] = useState(undefined);

    const [selectedLanguages, setSelectedLanguages] = useState(properties.preferredLanguages || new Set([properties.currentLanguage]));

    const onSelectedLanguagesChange = (value: Set<string>) => {
        if (value.size) {
            setSelectedLanguages(value);
            properties.preferredLanguages = value;
            loadTranslations(value);
        }
    };

    const contextValue: DialogContextType = {
        ...props,
        loading, saving, success, error,
        availableLanguages, selectedLanguages, onSelectedLanguagesChange, editDisabled, onTranslationInputChange, translations, onSave
    };

    return (
        <TranslationDialogContext.Provider value={contextValue}>
            <div style={{fontFamily: "Rubik, Roboto, Arial"}} data-polygloat-restricted={true}>
                <TranslationDialogInner/>
            </div>
        </TranslationDialogContext.Provider>
    )
};