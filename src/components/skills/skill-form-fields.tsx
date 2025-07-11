import { ImageFormFields } from "components/image/image-form-fields";
import type { SkillFormType } from "components/skills/skill-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { formatAlt } from "libs/skills/alt";
import type { FC } from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export const SkillFormFields: FC = () => {
    const form = useFormContext<SkillFormType>();

    const { control, getValues, setValue } = form;

    const [oldName, setOldName] = useState(getValues("name"));

    return (
        <>
            <FormField
                control={control}
                name="name"
                rules={{
                    onChange: () => {
                        const [name, altEn, altFr] = getValues([
                            "name",
                            "image.altEn",
                            "image.altFr"
                        ]);

                        const { newAltEn, newAltFr } = formatAlt(oldName, name, altEn, altFr);

                        setValue("image.altEn", newAltEn, {
                            shouldValidate: form.formState.isSubmitted
                        });
                        setValue("image.altFr", newAltFr, {
                            shouldValidate: form.formState.isSubmitted
                        });
                        setOldName(name);
                    }
                }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <ImageFormFields />
        </>
    );
};
