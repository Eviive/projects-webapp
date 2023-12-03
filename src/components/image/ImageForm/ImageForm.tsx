import { Input } from "@nextui-org/react";
import type { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { Image, WithImageFile } from "types/entities";

type ImageFormValues = WithImageFile<{ image: Image }>;

export const ImageForm: FC = () => {

    const {
        control,
        getValues
    } = useFormContext<ImageFormValues>();

    return (
        <>
            <Controller
                name="image.file"
                control={control}
                rules={{
                    validate: value => {
                        console.log(value);
                        const imageFile = value.item(0);
                        if (imageFile?.size && imageFile.size > 3 * 1024 * 1024) {
                            return `Image size cannot exceed 3MB (currently ${(imageFile.size / 1024 / 1024).toFixed(1)})`;
                        }
                    }
                }}
                render={({ field, fieldState }) => (
                    <div className="flex flex-col w-full">
                        <label>Image file</label>
                        <input
                            ref={field.ref}
                            name={field.name}
                            onChange={v => field.onChange(v.target.files)}
                            onBlur={field.onBlur}
                            disabled={field.disabled}
                            type="file"
                            accept="image/*"
                        />
                        {fieldState.error && (
                            <span className="text-tiny text-danger">{fieldState.error.message}</span>
                        )}
                    </div>
                )}
            />

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
                        isDisabled={field.disabled}
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
                        isDisabled={field.disabled}
                    />
                )}
            />
        </>
    );
};
