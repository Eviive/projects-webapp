import { Button as NextUIButton } from "@nextui-org/react";
import type { ComponentProps, FC } from "react";
import { forwardRef } from "react";

type Props = ComponentProps<typeof NextUIButton>;

const Button: FC<Props> = forwardRef<HTMLButtonElement | null, Props>((props, ref) => {
    return (
        <NextUIButton ref={ref} {...props}>
            {props.children}
        </NextUIButton>
    );
});

Button.displayName = "Button";

export { Button };
