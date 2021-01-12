import {Polygloat} from "@polygloat/core";

const HOST = process.env.TEST_POLYGLOAT_API_HOST || "localhost";
const PORT = process.env.TEST_POLYGLOAT_API_PORT || 8202

const polygloat = new Polygloat({
    watch: true,
    targetElement: document.body,
    apiUrl: "http://" + HOST + ":" + PORT,
    apiKey: "this_is_dummy_api_key",
    highlightColor: "yellow"
});

polygloat.translate("sampleApp.english_text_one").then(t => {
    const htmlElement = document.createElement("div");
    document.body.append(htmlElement);
    htmlElement.append(t);
})
polygloat.translate("sampleApp.hello_world!").then(t => {
    const select = document.createElement("select");
    const option = document.createElement("option");
    const option2 = document.createElement("option");
    select.append(option);
    select.append(option2);
    option.innerHTML = t;
    option2.innerHTML = "Not translated";
    document.body.append(select);
})

polygloat.run();

