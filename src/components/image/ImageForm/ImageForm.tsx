import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import type { FC } from "react";
import { useFormContext } from "react-hook-form";

import type { ImageWithFile } from "types/entities/image";

export const ImageForm: FC = () => {

    const form = useFormContext<{ image: ImageWithFile }>();

    return (
        <>
            <FormField
                control={form.control}
                name="image.file"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image file</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="file"
                                value={undefined}
                                onChange={e => field.onChange(e.target.files)}
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
                    <FormItem>
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
                    <FormItem>
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
