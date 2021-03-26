import * as React from "react";
import {FunctionComponent, useState} from "react";
import {T} from "@tolgee/react";
import {ChooseLanguage} from "./ChooseLanguage";

export const Page: FunctionComponent = () => {
    const [disappeared, setDisappeared] = useState(false)

    function disappear() {
        setDisappeared(true)
    }

    return (
        <div>
            <ChooseLanguage/>
            <h1><T>sampleApp.hello_world!</T></h1>
            <h1><T>just_english</T></h1>
            {!disappeared &&
            <button onClick={() => disappear()}><T>disappears_on_click</T></button>}
        </div>
    )
}
