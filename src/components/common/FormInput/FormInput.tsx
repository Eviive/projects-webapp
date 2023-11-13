import { Input as NextUIInput } from "@nextui-org/react";
import type { ChangeEvent, ComponentProps } from "react";
import type { Control, FieldValues, Path, UseControllerProps } from "react-hook-form";
import { Controller } from "react-hook-form";

type Props<F extends FieldValues> = Omit<ComponentProps<typeof NextUIInput>, "name"> & {
    name: Path<F>;
    control: Control<F>;
    rules?: UseControllerProps<F>["rules"];
    handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const FormInput = <F extends FieldValues>({ name, control, rules, handleChange, ...inputProps }: Props<F>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, formState }) => (
                <NextUIInput
                    {...inputProps}
                    value={field.value}
                    onChange={e => {
                        field.onChange(e);
                        handleChange?.(e);
                    }}
                    onBlur={field.onBlur}
                    errorMessage={formState.errors[name]?.message?.toString()}
                />
            )}
        />
    );
};
