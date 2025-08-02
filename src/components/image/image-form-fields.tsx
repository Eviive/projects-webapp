import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import type { FC } from "react";
import { useFormContext } from "react-hook-form";
import type { ImageCreationWithFile } from "types/entities/image";

interface Props {
    classNames?: {
        imageFile?: string;
        imageAltEn?: string;
        imageAltFr?: string;
    };
}

export const ImageFormFields: FC<Props> = ({ classNames }) => {
    const form = useFormContext<{ image: ImageCreationWithFile }>();

    return (
        <>
            <FormField
                control={form.control}
                name="image.file"
                render={({ field }) => (
                    <FormItem className={classNames?.imageFile}>
                        <FormLabel>Image file</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="file"
                                value={undefined}
                                onChange={e => {
                                    field.onChange(e.target.files);
                                }}
                                className="file:text-foreground cursor-pointer file:cursor-pointer"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="image.altEn"
                render={({ field }) => (
                    <FormItem className={classNames?.imageAltEn}>
                        <FormLabel>Image english alt</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="image.altFr"
                render={({ field }) => (
                    <FormItem className={classNames?.imageAltFr}>
                        <FormLabel>Image french alt</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};
