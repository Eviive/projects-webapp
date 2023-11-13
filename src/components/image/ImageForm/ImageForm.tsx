import { FormInput } from "components/common";
import type { FC } from "react";
import { useFormContext } from "react-hook-form";
import type { Image, WithImageFile } from "types/entities";

type ImageFormValues = WithImageFile<{ image: Image }>;

export const ImageForm: FC = () => {

    const { control } = useFormContext<ImageFormValues>();

    return (
        <>
            <FormInput
                name="image.file"
                control={control}
                label="Image file"
                type="file"
                accept="image/*"
            />

            <FormInput
                name="image.altEn"
                control={control}
                rules={{
                    required: "Image english alt is required",
                    maxLength: {
                        value: 255,
                        message: "Image english alt cannot exceed 255 characters"
                    }
                }}
                label="Image english alt"
                isRequired
            />

            <FormInput
                name="image.altFr"
                control={control}
                rules={{
                    maxLength: {
                        value: 255,
                        message: "Image french alt cannot exceed 255 characters"
                    }
                }}
                label="Image french alt"
                isRequired
            />
        </>
    );
};
