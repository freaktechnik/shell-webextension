//TODO all_frames false option
//TODO matches & match about blank option

const run = (contentScript) => {
    try {
        eval(contentScript.src);
    }
    catch(e) {
        browser.runtime.sendMessage({
            type: "error",
            source: "contentScript",
            error: e
        });
    }
    browser.runtime.sendMessage({
        type: "load",
        source: "contentScript"
    });
};

const shouldRun = (contentScript) => {
    switch(document.readyState) {
        case "loading":
            return contentScript.run_at === "document_start";
        case "interactive":
            return contentScript.run_at === "document_end" || contentScript.run_at === "document_start";
        default:
            return true;
    }
};

const loadListener = () => {
    if(shouldRun(contentScript)) {
        run(contentScript);
        document.removeEventListener("readystatechange", loadListener);
    }
};

browser.storage.local.get({
    contentScript: {}
}).then(({ contentScript }) => {
    if(shouldRun(contentScript)) {
        run(contentScript);
    }
    else {
        document.addEventListener("readystatechange", loadListener, {
            passive: true
        });
    }
});
