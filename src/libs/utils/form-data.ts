type FormDataPart = {
    name: string;
} & (FormDataPartJson | FormDataPartBlob);

interface FormDataPartJson {
    type: "json";
    value: unknown;
}

interface FormDataPartBlob {
    type: "blob";
    value: Blob;
}

export const buildFormData = (...parts: FormDataPart[]): FormData => {
    const formData = new FormData();

    for (const part of parts) {
        switch (part.type) {
            case "json":
                formData.append(
                    part.name,
                    new Blob([JSON.stringify(part.value)], { type: "application/json" })
                );
                break;
            case "blob":
                formData.append(part.name, part.value);
                break;
        }
    }

    return formData;
};
