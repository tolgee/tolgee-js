import {Tolgee} from "@tolgee/core";

const tolgee = new Tolgee({
    watch: true,
    targetElement: document.body,
    highlightColor: "yellow"
});

tolgee.onLangChange.subscribe(() => {
    refresh();
})


const refresh = () => tolgee.translate("test").then(t => {
    document.body = document.createElement("body");
    const htmlElement = document.createElement("div");
    document.body.append(htmlElement);
    htmlElement.append(t);
    const p = document.createElement("p");
    window.setLang = () => tolgee.lang = "cs";
    p.innerHTML = "<button onclick='window.setLang()'>cs</button>"
    document.body.append(p);
})

refresh();

tolgee.run();
