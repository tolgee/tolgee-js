import * as React from 'react';
import {useContext} from 'react';
import {TranslationDialogContext} from "./TranslationDialog";
import {LanguageSelect} from "./LanguageSelect";
import {TranslationFields} from "./TranslationFields";
import {Dialog} from './common/Dialog';
import {Button} from './common/Button';
import {TextHelper} from '@tolgee/core/lib/helpers/TextHelper'

export default () => {
    let context = useContext(TranslationDialogContext);

    return (
        <div>
            <Dialog open={context.open} onClose={context.onClose} aria-labelledby="form-dialog-title" style={{width: "700px"}}>

                <h3 style={{marginTop: 0}}>Translate text</h3>
                <p style={{marginTop: 0, marginBottom: "20px"}}>{context.input && TextHelper.removeEscapes(context.input)}</p>
                <LanguageSelect/>

                <div style={{marginTop: "20px"}}>
                    <TranslationFields/>
                </div>
                {
                    context.editDisabled && !context.loading &&
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
