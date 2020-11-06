import * as umd from "../../../..";
import * as commonjs from "../../../../dist/polygloat.commonjs";
import '../../../../dist/polygloat.window';

[umd, commonjs["@polygloat/core"], window["@polygloat/core"]].forEach(bundle => {
    console.log(bundle)
    const bundleDivElement = document.createElement("div");

    const polygloat = new bundle.Polygloat({watch: true, targetElement: bundleDivElement});


    bundleDivElement.setAttribute("id", bundle);

    document.body.append(bundleDivElement);

    const htmlParagraphElement = document.createElement("p");

    bundleDivElement.append(htmlParagraphElement);

    polygloat.run().then(() => {
        polygloat.translate("test").then(t => {
            htmlParagraphElement.append(t);
            bundleDivElement.append("%-%polygloat:test%-%")
        });
    });
})
