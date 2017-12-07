class SerializedForm {
    constructor(form) {
        this.form = form;
        this.form.addEventListener("submit", (e) => this.onSubmit(e));
        this.form.addEventListener("input", () =>  this.onInputs(), true);
        this.deserialize().catch(console.error);
    }

    onInputs() {
        this.toggleApplied(false);
    }

    async deserialize() {
        const data = await browser.storage.local.get(this.form.id);
        if(this.form.id in data && data[this.form.id]) {
            const values = data[this.form.id];
            for(const key in values) {
                const el = this.form.elements[key];
                if(el) {
                    el.value = values[key];
                }
            }
        }
    }

    serialize() {
        const inputs = this.form.elements;
        const data = {};
        for(const input of inputs) {
            data[input.name] = input.value;
        }
        return browser.storage.local.set({
            [this.form.id]: data
        });
    }

    onSubmit(event) {
        event.preventDefault();
        this.serialize().catch(console.error);
    }

    toggleApplied(visible) {
        this.form.querySelector(".applied").classList.toggle("hidden", !visible);
    }
}

for(const form of document.forms) {
    new SerializedForm(form);
}

const errorOutputs = document.querySelectorAll('.error');
browser.runtime.onMessage.addListener((message) => {
    console.log(message);
    if(message.type === "error") {
        for(const output of errorOutputs) {
            if(output.dataset.for === message.source) {
                output.textContent = message.error.toString();
                output.classList.remove("hidden");
            }
        }
    }
    else if(message.type === "load") {
        const applied = document.querySelector(`#${message.source} .applied`);
        applied.classList.remove("hidden");
    }
})
