import { useQuery } from "@tanstack/react-query";
import { SkillService } from "api/services";
import { Loader, Page, SearchBar } from "components/common";
import { SkillCard, SkillFormModal } from "components/skills";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Button } from "components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { GridLayout } from "layouts";
import { getTitleAndMessage } from "lib/utils/error";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { LuAlertCircle } from "react-icons/lu";

export const Skills: FC = () => {

    const query = useQuery({
        queryKey: [ "skills" ],
        queryFn: SkillService.findAll
    });

    const error = query.isError ? getTitleAndMessage(query.error) : null;

    const [ searchBarValue, setSearchBarValue ] = useState("");
    const [ searchQuery, setSearchQuery ] = useState(searchBarValue);

    const filteredSkillItems = useMemo(() => (
        query.isSuccess
            ? query.data.filter(skill => skill.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
            : []
    ), [ query.isSuccess, query.data, searchQuery ]);

    return (
        <Page title="Skills">
            <div className="grow w-full h-full px-[5%] py-12 flex flex-col gap-12">
                <div className="self-center max-w-md w-full flex items-center gap-2">
                    <SearchBar
                        value={searchBarValue}
                        handleChange={setSearchBarValue}
                        debounce={300}
                        handleDebounce={setSearchQuery}
                        isDisabled={query.isLoading || query.isError}
                    />
                    <TooltipProvider>
                        <Tooltip>
                            <SkillFormModal
                                skill={null}
                                trigger={
                                    <TooltipTrigger asChild>
                                        <Button
                                            className="text-foreground-500"
                                            variant="outline"
                                            size="icon"
                                        >
                                            <FaPlus size={20} />
                                        </Button>
                                    </TooltipTrigger>
                                }
                            />
                            <TooltipContent>
                                Add a new skill
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                {query.isSuccess && (
                    <GridLayout
                        minWidth="140px"
                        gap="2em"
                        columnCount="infinity"
                        centerHorizontally
                    >
                        {filteredSkillItems.map(skill => (
                            <SkillCard
                                key={skill.id}
                                skill={skill}
                            />
                        ))}
                    </GridLayout>
                )}
                {query.isLoading && (
                    <Loader />
                )}
                {query.isError && error !== null && (
                    <Alert variant="destructive">
                        <LuAlertCircle className="h-4 w-4" />
                        <AlertTitle>{error.title}</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}
            </div>
        </Page>
    );
};
