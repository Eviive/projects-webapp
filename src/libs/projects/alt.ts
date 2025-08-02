interface ProjectsAltOutput {
    newAltEn: string;
    newAltFr: string;
}

export const formatAlt = (
    oldTitle: string,
    title: string,
    altEn: string,
    altFr: string
): ProjectsAltOutput => {
    const isTitleEmpty = title.trim() === "";

    let newAltEn = altEn;
    let newAltFr = altFr;

    if (
        altEn.trim() === "" ||
        altEn === `${oldTitle.trim()}'${oldTitle.trim().endsWith("s") ? "" : "s"} logo`
    ) {
        if (isTitleEmpty) {
            newAltEn = "";
        } else {
            newAltEn = `${title.trim()}'${title.trim().endsWith("s") ? "" : "s"} logo`;
        }
    }

    if (altFr.trim() === "" || altFr === "Logo de " + oldTitle.trim()) {
        if (isTitleEmpty) {
            newAltFr = "";
        } else {
            newAltFr = "Logo de " + title.trim();
        }
    }

    return { newAltEn, newAltFr };
};
