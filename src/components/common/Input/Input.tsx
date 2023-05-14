import { FC, FormEventHandler, InputHTMLAttributes, ReactNode } from "react";

type Attributes = InputHTMLAttributes<HTMLInputElement> & { name: string; };

type Props = {
    attributes: Attributes;
    label?: ReactNode;
    wrapperClassName?: string;
    handleInvalid?: FormEventHandler<HTMLInputElement>;
};

export const Input: FC<Props> = (({ attributes, label, wrapperClassName, handleInvalid }) => {

    const type = attributes.type ?? "text";

    return (
        <div className={wrapperClassName}>
            {label && <label htmlFor={`input-${attributes.name}`}>{label}{typeof label === "string" && " :"}</label>}
            <input
                {...attributes}
                id={`input-${attributes.name}`}
                type={type}
                placeholder={attributes.placeholder}
                pattern={attributes.pattern}
                required={attributes.required}
                onInput={handleInvalid && (e => e.currentTarget.setCustomValidity(""))}
                onInvalid={handleInvalid}
            />
        </div>
    );
});
