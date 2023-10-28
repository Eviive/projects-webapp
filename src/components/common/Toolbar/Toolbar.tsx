import { Button } from "components/common";
import type { FC, PropsWithChildren } from "react";

type Tool = {
    name: string;
    handleClick: () => (void | Promise<void>);
    loading?: boolean;
    disabled?: boolean;
};

type Props = {
    tools: PropsWithChildren<Tool>[];
};

export const Toolbar: FC<Props> = props => {
    return (
        <div className="z-50 fixed bottom-6 right-6 flex gap-4">
            {props.tools.map(tool => (
                <Button
                    key={tool.name}
                    isLoading={tool.loading}
                    isDisabled={tool.disabled}
                    onClick={tool.handleClick}
                    isIconOnly
                    size="lg"
                    radius="full"
                    color="danger"
                >
                    {!tool.loading && tool.children}
                </Button>
            ))}
        </div>
    );
};
