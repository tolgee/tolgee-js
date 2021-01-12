import * as umd from "../../node_modules/@polygloat/core/dist/polygloat.umd";
import * as commonjs from "../../node_modules/@polygloat/core/dist/polygloat.commonjs";
import '../../node_modules/@polygloat/core/dist/polygloat.window';

[umd, commonjs["@polygloat/core"], window["@polygloat/core"]].forEach(bundle => {
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
