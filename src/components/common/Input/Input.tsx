import { Input as NextUIInput } from "@nextui-org/react";
import type { ComponentProps, FC } from "react";
import { forwardRef } from "react";

type Props = ComponentProps<typeof NextUIInput>;

const Input: FC<Props> = forwardRef<HTMLInputElement, Props>((props, ref) => {
    return (
        <NextUIInput
            {...props}
            ref={ref}
            id={`input-${props.name}`}
            isRequired={props.isRequired ?? props.required}
        />
    );
});

Input.displayName = "Input";

export { Input };
