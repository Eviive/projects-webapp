import { FC, FormEventHandler, InputHTMLAttributes, ReactNode } from "react";

type Attributes = InputHTMLAttributes<HTMLInputElement> & { name: string; };

type Props = {
    attributes: Attributes;
    label?: ReactNode;
    handleInvalid?: FormEventHandler<HTMLInputElement>;
};

export const Input: FC<Props> = (({ attributes, label, handleInvalid }) => {

    const type = attributes.type ?? "text";

    return (
        <div className={attributes.className}>
            {label && <label htmlFor={`input-${attributes.name}`}>{label}{typeof label === "string" && " :"}</label>}
            <input
                {...attributes}
                id={`input-${attributes.name}`}
                type={type}
                placeholder={attributes.placeholder}
                pattern={attributes.pattern ?? ".*\\S.*"} // prevents whitespace-only input
                required={attributes.required}
                onInput={handleInvalid && (e => e.currentTarget.setCustomValidity(""))}
                onInvalid={handleInvalid}
            />
        </div>
    );
});
