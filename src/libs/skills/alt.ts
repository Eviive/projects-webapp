interface SkillsAltOutput {
    newAltEn: string;
    newAltFr: string;
}

export const formatAlt = (
    oldName: string,
    name: string,
    altEn: string,
    altFr: string
): SkillsAltOutput => {
    const isNameEmpty = name.trim() === "";

    let newAltEn = altEn;
    let newAltFr = altFr;

    if (
        altEn.trim() === "" ||
        altEn === `${oldName.trim()}'${oldName.trim().endsWith("s") ? "" : "s"} logo`
    ) {
        if (isNameEmpty) {
            newAltEn = "";
        } else {
            newAltEn = `${name.trim()}'${name.trim().endsWith("s") ? "" : "s"} logo`;
        }
    }

    if (altFr.trim() === "" || altFr === "Logo de " + oldName.trim()) {
        if (isNameEmpty) {
            newAltFr = "";
        } else {
            newAltFr = "Logo de " + name.trim();
        }
    }

    return { newAltEn, newAltFr };
};
