import { FC, FormEventHandler, InputHTMLAttributes, ReactNode } from "react";

const TEXT_INPUT = [ "text", "search", "url", "tel", "email", "password", "number" ];

type Attributes = InputHTMLAttributes<HTMLInputElement> & { name: string; };

type Props = {
    attributes: Attributes;
    label?: ReactNode;
    handleInvalid?: FormEventHandler<HTMLInputElement>;
}

export const Input: FC<Props> = (({ attributes, label, handleInvalid }) => {

    const type = attributes.type ?? "text";

    const placeholder = attributes.placeholder ?? (
        TEXT_INPUT.includes(type)
            ? `${attributes.name.charAt(0).toUpperCase()}${attributes.name.substring(1)}`
            : undefined
    );

    return (
        <div className={attributes.className}>
            {label && <label htmlFor={`input-${attributes.name}`}>{label}</label>}
            <input
                {...attributes}
                id={`input-${attributes.name}`}
                type={type}
                placeholder={placeholder}
                pattern={attributes.pattern ?? ".*\\S.*"} // prevents whitespace-only input
                required={attributes.required ?? (type !== "checkbox")}
                onInput={handleInvalid && (e => e.currentTarget.setCustomValidity(""))}
                onInvalid={handleInvalid}
            />
        </div>
    );
});
