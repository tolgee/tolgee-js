import {Polygloat} from "../../../..";

const polygloat = new Polygloat({
    watch: true,
    targetElement: document.body,
    apiUrl: "http://" + process.env.TEST_POLYGLOAT_API_HOST + ":" + process.env.TEST_POLYGLOAT_API_PORT,
    apiKey: "this_is_dummy_api_key",
    highlightColor: "yellow"
});

polygloat.translate("sampleApp.english_text_one").then(t => {
    const htmlElement = document.createElement("el");
    document.body.append(htmlElement);
    htmlElement.append(t);
})

polygloat.run();

