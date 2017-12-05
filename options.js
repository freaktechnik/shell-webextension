class SerializedForm {
    constructor(form) {
        this.form = form;
        this.form.addEventListener("submit", (e) => this.onSubmit(e));
        this.deserialize().catch(console.error);
    }

    async deserialize() {
        const data = await browser.storage.local.get(this.form.id);
        if(this.form.id in data && data[this.form.id]) {
            const values = data[this.form.id];
            for(const key in values) {
                const el = document.querySelector(`[name="${key}"]`);
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
}

for(const form of document.forms) {
    new SerializedForm(form);
}
