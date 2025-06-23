import { useQuery } from "@tanstack/react-query";
import { SkillService } from "api/services/skill";
import { ImageFormFields } from "components/image/image-form-fields";
import type { ProjectFormType } from "components/projects/project-form";
import { CalendarInput } from "components/ui/calendar-input";
import { Checkbox } from "components/ui/checkbox";
import { Combobox } from "components/ui/combobox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { formatISO } from "date-fns";
import { SKILL_PLACEHOLDER } from "libs/constants";
import { getImageUrl } from "libs/image";
import { isNotNullOrUndefined } from "libs/utils/assertion";
import type { FC } from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { Skill } from "types/entities/skill";

export const ProjectFormFields: FC = () => {
    const skillsQuery = useQuery({
        queryKey: ["skills"],
        queryFn: SkillService.findAll
    });

    const form = useFormContext<ProjectFormType>();

    const { control, getValues, setValue } = form;

    const [oldTitle, setOldTitle] = useState(getValues("title"));

    return (
        <>
            <FormField
                control={control}
                name="title"
                rules={{
                    onChange: () => {
                        const [title, altEn, altFr] = getValues([
                            "title",
                            "image.altEn",
                            "image.altFr"
                        ]);

                        // TODO: name finishing by an s
                        const isTitleEmpty = !title.trim(),
                            isAltEnEmpty = !altEn.trim(),
                            isAltFrEmpty = !altFr.trim(),
                            isAltEnFormatted = altEn === `${oldTitle.trim()}'s logo`,
                            isAltFrFormatted = altFr === `Logo de ${oldTitle.trim()}`;

                        if (isAltEnEmpty || isAltEnFormatted) {
                            setValue("image.altEn", isTitleEmpty ? "" : `${title.trim()}'s logo`, {
                                shouldValidate: form.formState.isSubmitted
                            });
                        }
                        if (isAltFrEmpty || isAltFrFormatted) {
                            setValue("image.altFr", isTitleEmpty ? "" : `Logo de ${title.trim()}`, {
                                shouldValidate: form.formState.isSubmitted
                            });
                        }

                        setOldTitle(title);
                    }
                }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="creationDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Creation date</FormLabel>
                        <FormControl>
                            <CalendarInput
                                mode="single"
                                selected={
                                    isNotNullOrUndefined(field.value)
                                        ? new Date(field.value)
                                        : undefined
                                }
                                onSelect={date => {
                                    if (isNotNullOrUndefined(date)) {
                                        field.onChange(formatISO(date, { representation: "date" }));
                                    }
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="descriptionEn"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description (English)</FormLabel>
                        <FormControl>
                            <Textarea {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="descriptionFr"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description (French)</FormLabel>
                        <FormControl>
                            <Textarea {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="repoUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Repository URL</FormLabel>
                        <FormControl>
                            <Input {...field} type="url" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="demoUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Demonstration URL</FormLabel>
                        <FormControl>
                            <Input {...field} type="url" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="skills"
                render={({ field }) => (
                    <FormItem className="col-span-2">
                        <FormLabel>Skills</FormLabel>
                        <Combobox
                            selection="multiple"
                            options={skillsQuery.data ?? []}
                            value={field.value}
                            onChange={(skill, isSelected) => {
                                let newSkills: Skill[];

                                if (isSelected) {
                                    const nextIndex = field.value.findIndex(
                                        s => s.sort > skill.sort
                                    );

                                    newSkills =
                                        nextIndex === -1
                                            ? [...field.value, skill]
                                            : [
                                                  ...field.value.slice(0, nextIndex),
                                                  skill,
                                                  ...field.value.slice(nextIndex)
                                              ];
                                } else {
                                    newSkills = field.value.filter(s => s.id !== skill.id);
                                }

                                field.onChange(newSkills);
                            }}
                            renderItem={skill => (
                                <div className="flex items-center gap-2">
                                    <img
                                        className="drop-shadow-icon aspect-square object-cover"
                                        src={
                                            getImageUrl(skill.image, "skills") ?? SKILL_PLACEHOLDER
                                        }
                                        alt={skill.image.altEn}
                                        width={22}
                                        loading="lazy"
                                    />
                                    {skill.name}
                                </div>
                            )}
                            getKey={skill => skill.id}
                            getValue={skill => skill.name}
                            placeholder="Select skills"
                            searchPlaceholder="Search skill..."
                            empty={skillsQuery.data?.length === 0 && "No skills found."}
                            loading={skillsQuery.isLoading && "Loading skills..."}
                            error={skillsQuery.isError && "Failed to load skills."}
                        />

                        <FormMessage />
                    </FormItem>
                )}
            />

            <ImageFormFields classNames={{ imageFile: "col-span-2" }} />

            <FormField
                control={control}
                name="featured"
                render={({ field }) => (
                    <FormItem className="col-span-2 flex items-center gap-2 space-y-0">
                        <FormLabel>Featured</FormLabel>
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};
