//TODO all_frames false option
//TODO matches & match about blank option

const run = (contentScript) => {
    eval(contentScript.src);
};

const shouldRun = (contentScript) => {
    switch(document.readyState) {
        case "loading":
            return contentScript.run_at === "document_start";
        case "interactive":
            return contentScript.run_at === "document_end";
        default:
            return contentScript.run_at === "document_idle";
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
