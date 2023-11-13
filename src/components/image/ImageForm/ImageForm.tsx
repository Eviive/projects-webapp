import { Input } from "@nextui-org/react";
import type { FC } from "react";
import { useFormContext } from "react-hook-form";
import type { Image, WithImageFile } from "types/entities";

type ImageFormValues = WithImageFile<{ image: Image }>;

export const ImageForm: FC = () => {

    const { register } = useFormContext<ImageFormValues>();

    return (
        <>
            <Input
                {...register("image.file")}
                label="Image file"
                type="file"
                accept="image/*"
            />

            <Input
                {...register("image.altEn")}
                label="Image english alt"
                maxLength={255}
                isRequired
            />

            <Input
                {...register("image.altFr")}
                label="Image french alt"
                maxLength={255}
                isRequired
            />
        </>
    );
};
