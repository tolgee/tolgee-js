import {Polygloat} from "@polygloat/core";

const polygloat = new Polygloat({
    watch: true,
    targetElement: document.body,
    highlightColor: "yellow"
});

polygloat.onLangChange.subscribe(() => {
    refresh();
})


const refresh = () => polygloat.translate("test").then(t => {
    document.body = document.createElement("body");
    const htmlElement = document.createElement("div");
    document.body.append(htmlElement);
    htmlElement.append(t);
    const p = document.createElement("p");
    window.setLang = () => polygloat.lang = "cs";
    p.innerHTML = "<button onclick='window.setLang()'>cs</button>"
    document.body.append(p);
})

refresh();

polygloat.run();
