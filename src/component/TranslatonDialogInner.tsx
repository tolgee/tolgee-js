import * as React from 'react';
import {useContext} from 'react';
import {TranslationDialogContext} from "./TranslationDialog";
import {LanguageSelect} from "./LanguageSelect";
import {TranslationFields} from "./TranslationFields";
import {Dialog} from './common/Dialog';
import {Button} from './common/Button';

export default () => {
    let context = useContext(TranslationDialogContext);

    return (
        <div>
            <Dialog open={context.open} onClose={context.onClose} aria-labelledby="form-dialog-title" style={{width: "700px"}}>

                <h2 style={{marginTop: 0}}>{context.input}</h2>
                <LanguageSelect/>

                <div style={{marginTop: "5px"}}>
                    <TranslationFields/>
                </div>
                {
                    context.editDisabled &&
                    <>"Modification is restricted due to missing translations.edit scope in current api key settings."</>
                }

                {context.error &&
                <div style={{color: "red"}}>
                    {context.error}
                </div>}
                <div style={{display: "flex", justifyContent: "flex-end", marginTop: "10px"}}>
                    <Button onClick={context.onClose} variant="default">
                        Cancel
                    </Button>
                    <Button
                        disabled={context.saving || context.editDisabled}
                        onClick={context.onSave}
                        variant="primary"
                        style={{marginLeft: "10px"}}
                    >
                        {context.success ? 'Saved! ✓' : context.saving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}
