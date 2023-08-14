import { Input } from "components/common";
import type { FC } from "react";
import { useFormContext } from "react-hook-form";
import type { Image, WithImageFile } from "types/entities";

type ImageFormValues = WithImageFile<{ image: Image }>;

type Props = {
    inputsClassName?: string;
};

export const ImageForm: FC<Props> = ({ inputsClassName }) => {

    const { register } = useFormContext<ImageFormValues>();

    return (
        <>
            <Input
                attributes={{
                    ...register("image.file"),
                    type: "file",
                    accept: "image/*"
                }}
                label="Image file"
                wrapperClassName={inputsClassName}
            />

            <Input
                attributes={{
                    ...register("image.altEn"),
                    maxLength: 255,
                    required: true
                }}
                label="Image english alt"
                wrapperClassName={inputsClassName}
            />

            <Input
                attributes={{
                    ...register("image.altFr"),
                    maxLength: 255,
                    required: true
                }}
                label="Image french alt"
                wrapperClassName={inputsClassName}
            />
        </>
    );
};
