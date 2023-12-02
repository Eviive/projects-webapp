import { Input } from "@nextui-org/react";
import type { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { Image, WithImageFile } from "types/entities";

type ImageFormValues = WithImageFile<{ image: Image }>;

export const ImageForm: FC = () => {

    const {
        control,
        register,
        getValues,
        formState: {
            errors
        }
    } = useFormContext<ImageFormValues>();

    return (
        <>
            <div>
                <label>Image file</label>
                <input
                    {...register("image.file", {
                        validate: value => {
                            const imageFile = value.item(0);
                            if (imageFile?.size && imageFile.size > 3 * 1024 * 1024) {
                                return `Image size cannot exceed 3MB (currently ${(imageFile.size / 1024 / 1024).toFixed(1)})`;
                            }
                        }
                    })}
                    type="file"
                    accept="image/*"
                />
                {errors.image?.file && (
                    <span>{errors.image?.file.message}</span>
                )}
            </div>

            <Controller
                name="image.altEn"
                control={control}
                rules={{
                    required: "Image english alt is required",
                    maxLength: {
                        value: 255,
                        message: `Image english alt cannot exceed 255 characters (currently ${getValues("image.altEn")?.length})`
                    }
                }}
                defaultValue=""
                render={({ field, fieldState }) => (
                    <Input
                        {...field}
                        label="Image english alt"
                        errorMessage={fieldState.error?.message}
                        isRequired
                    />
                )}
            />

            <Controller
                name="image.altFr"
                control={control}
                rules={{
                    required: "Image french alt is required",
                    maxLength: {
                        value: 255,
                        message: `Image french alt cannot exceed 255 characters (currently ${getValues("image.altFr")?.length})`
                    }
                }}
                defaultValue=""
                render={({ field, fieldState }) => (
                    <Input
                        {...field}
                        label="Image french alt"
                        errorMessage={fieldState.error?.message}
                        isRequired
                    />
                )}
            />
        </>
    );
};
