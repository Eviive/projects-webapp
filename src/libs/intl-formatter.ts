export const monthYearFormatter = Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric"
});

export const conjunctionListFormatter = new Intl.ListFormat("en-GB", {
    style: "long",
    type: "conjunction"
});

export const disjunctionListFormatter = new Intl.ListFormat("en-GB", {
    style: "long",
    type: "disjunction"
});
