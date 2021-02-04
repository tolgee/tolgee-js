import * as umd from "../../node_modules/@tolgee/core/dist/tolgee.umd";
import * as commonjs from "../../node_modules/@tolgee/core/dist/tolgee.commonjs";
import '../../node_modules/@tolgee/core/dist/tolgee.window';

[umd, commonjs["@tolgee/core"], window["@tolgee/core"]].forEach(bundle => {
    const bundleDivElement = document.createElement("div");

    const tolgee = new bundle.Tolgee({watch: true, targetElement: bundleDivElement});


    bundleDivElement.setAttribute("id", bundle);

    document.body.append(bundleDivElement);

    const htmlParagraphElement = document.createElement("p");

    bundleDivElement.append(htmlParagraphElement);

    tolgee.run().then(() => {
        tolgee.translate("test").then(t => {
            htmlParagraphElement.append(t);
            bundleDivElement.append("%-%tolgee:test%-%")
        });
    });
})
