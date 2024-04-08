import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageService } from "api/services/image";
import { ProjectService } from "api/services/project";
import { SkillService } from "api/services/skill";
import { ImageForm } from "components/image/image-form";
import { Button } from "components/ui/button";
import { Calendar } from "components/ui/calendar";
import { Checkbox } from "components/ui/checkbox";
import { Combobox } from "components/ui/combobox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Textarea } from "components/ui/textarea";
import { useConfirmDialogContext } from "contexts/confirm-dialog-context";
import { format } from "date-fns";
import { useFormSubmissionState } from "hooks/use-form-submission-state";
import { SKILL_PLACEHOLDER } from "lib/constants";
import { getFormattedTitleAndMessage } from "lib/utils/error";
import { cn } from "lib/utils/style";
import type { FC } from "react";
import { useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { LuCalendar } from "react-icons/lu";
import type {
    Project,
    ProjectCreation,
    ProjectCreationWithFile,
    ProjectEditionWithFile
} from "types/entities/project";
import { projectCreationSchema, projectEditionWithFileSchema } from "types/entities/project";
import type { Skill } from "types/entities/skill";

type ProjectForm = ProjectCreationWithFile | ProjectEditionWithFile;

type Props = {
    project: Project | null;
    closeDialog: () => void;
};

export const ProjectForm: FC<Props> = props => {
    const confirm = useConfirmDialogContext();

    const queryClient = useQueryClient();

    const querySkills = useQuery({
        queryKey: ["skills"],
        queryFn: SkillService.findAll
    });

    const [submissionState, dispatchSubmissionState] = useFormSubmissionState();

    const form = useForm<ProjectForm>({
        resolver: zodResolver(
            props.project === null ? projectCreationSchema : projectEditionWithFileSchema
        ),
        defaultValues: props.project ?? {
            title: "",
            descriptionEn: "",
            descriptionFr: "",
            creationDate: new Date(),
            repoUrl: "",
            demoUrl: "",
            featured: false,
            skills: [],
            image: {
                altEn: "",
                altFr: ""
            }
        }
    });
    const {
        formState: { isDirty },
        control,
        getValues,
        setValue,
        handleSubmit
    } = form;

    const [oldTitle, setOldTitle] = useState(getValues("title"));

    const submitHandler: SubmitHandler<ProjectForm> = async data => {
        if (submissionState.isSubmittingEdition || submissionState.isSubmittingDeletion) return;

        if (!isDirty) return props.closeDialog();

        dispatchSubmissionState("editionStarted");

        const editing = !!props.project;

        const imageFile = data.image.file?.item(0);

        try {
            if (editing && "id" in data) {
                const project: Project = {
                    ...data,
                    image: {
                        id: data.image.id,
                        uuid: data.image.uuid,
                        altEn: data.image.altEn,
                        altFr: data.image.altFr
                    }
                };
                await ProjectService.update(project, imageFile);
            } else {
                const project: ProjectCreation = {
                    ...data,
                    image: {
                        altEn: data.image.altEn,
                        altFr: data.image.altFr
                    }
                };
                await ProjectService.save(project, imageFile);
            }

            await queryClient.invalidateQueries({
                queryKey: ["projects"]
            });

            props.closeDialog();
        } catch (e) {
            console.error(
                editing ? "Project update failed" : "Project creation failed",
                getFormattedTitleAndMessage(e)
            );
        } finally {
            dispatchSubmissionState("editionFinished");
        }
    };

    const handleDelete = async () => {
        if (submissionState.isSubmittingDeletion || submissionState.isSubmittingEdition) return;

        if (!props.project) return;

        dispatchSubmissionState("deletionStarted");

        const confirmed = await confirm({
            title: "Delete project",
            body: "Are you sure you want to delete this project?",
            confirmButton: "Delete"
        });

        if (!confirmed) return dispatchSubmissionState("deletionFinished");

        try {
            await ProjectService.delete(props.project.id);

            await queryClient.invalidateQueries({
                queryKey: ["projects"]
            });

            props.closeDialog();
        } catch (e) {
            console.error("Project deletion failed", getFormattedTitleAndMessage(e));
        } finally {
            dispatchSubmissionState("deletionFinished");
        }
    };

    return (
        <FormProvider {...form}>
            <form
                className="mb-2 grid grid-cols-[1fr_1fr] gap-x-4 gap-y-3"
                onSubmit={handleSubmit(submitHandler)}
            >
                <FormField
                    control={control}
                    name="title"
                    rules={{
                        onChange: () => {
                            const [title, altEn, altFr] = getValues([
                                    "title",
                                    "image.altEn",
                                    "image.altFr"
                                ]),
                                isTitleEmpty = !title.trim(),
                                isAltEnEmpty = !altEn.trim(),
                                isAltFrEmpty = !altFr.trim(),
                                isAltEnFormatted = altEn === `${oldTitle.trim()}'s logo`,
                                isAltFrFormatted = altFr === `Logo de ${oldTitle.trim()}`;

                            (isAltEnEmpty || isAltEnFormatted) &&
                                setValue(
                                    "image.altEn",
                                    isTitleEmpty ? "" : `${title.trim()}'s logo`
                                );
                            (isAltFrEmpty || isAltFrFormatted) &&
                                setValue(
                                    "image.altFr",
                                    isTitleEmpty ? "" : `Logo de ${title.trim()}`
                                );

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
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "flex w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <LuCalendar className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
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
                                options={querySkills.data ?? []}
                                value={field.value}
                                onChange={(skill, isSelected) => {
                                    let newSkills: Skill[];

                                    if (isSelected) {
                                        const nextIndex = field.value.findIndex(
                                            s => s.sort > skill.sort
                                        );

                                        newSkills = [
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
                                            className="aspect-square object-cover drop-shadow-[0_1px_1px_hsl(0deg,0%,0%,0.5)]"
                                            src={
                                                ImageService.getImageUrl(skill.image, "skills") ??
                                                SKILL_PLACEHOLDER
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
                                noOptionsText="No skills found."
                                loading={querySkills.isLoading}
                                loadingText="Loading skills..."
                                error={querySkills.isError}
                                errorText="An error occurred while loading skills."
                            />

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <ImageForm classNames={{ imageFile: "col-span-2" }} />

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

                <div className="col-span-2 mt-3 flex w-full justify-center gap-4">
                    {!!props.project && (
                        <Button
                            className="w-full max-w-[50%]"
                            variant="destructive"
                            disabled={
                                submissionState.isSubmittingEdition ||
                                submissionState.isSubmittingDeletion
                            }
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    )}
                    <Button
                        className="w-full max-w-[50%]"
                        type="submit"
                        disabled={
                            submissionState.isSubmittingEdition ||
                            submissionState.isSubmittingDeletion
                        }
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
