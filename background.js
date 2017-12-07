const frame = document.createElement("iframe");
const defaultPage = `<!DOCTYPE html>
<html>
    <body>
        {{backgroundScript}}
    </body>
</html>`;
const makeScriptFrame = (scriptSrc, pageSrc = defaultPage) => {
    /* can't seem to make this work :(
    const scriptBlob = new Blob([
        scriptSrc
    ]);
    const scriptURL = URL.createObjectURL(scriptBlob);
    const src = pageSrc.replace("{{backgroundScript}}", `<script src="${scriptURL}"></script>`);
    frame.addEventListener("error", (e) => console.error(e), true);
    frame.srcdoc = src;*/
    try {
        window.eval(scriptSrc);
    }
    catch(e) {
        browser.runtime.sendMessage({
            type: "error",
            source: "background",
            error: e
        });
    }
    browser.runtime.sendMessage({
        type: "load",
        source: "background"
    });
};

browser.storage.local.get({
    background: {}
}).then(({ background }) => {
    if(background.src) {
        makeScriptFrame(background.src);
    }
});

browser.storage.onChanged.addListener((changes, area) => {
    if(area === "local" && "background" in changes) {
        if(changes.background.newValue && changes.background.newValue.src) {
            makeScriptFrame(changes.background.newValue.src);
        }
    }
});
