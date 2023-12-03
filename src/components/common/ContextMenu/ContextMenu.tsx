import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { useCloseEvents } from "hooks/useCloseEvents";
import { useContextMenu } from "hooks/useContextMenu";
import { useDimensions } from "hooks/useDimensions";
import type { FC, Key } from "react";
import { useCallback } from "react";

export const ContextMenu: FC = () => {

    const { state, closeContextMenu } = useContextMenu();

    const { ref: dimensionsRef, dimensions } = useDimensions();

    const closeRef = useCloseEvents(closeContextMenu);

    const mergedRefs = useCallback((node: HTMLElement) => {
        dimensionsRef(node);
        closeRef.current = node;
    }, [ closeRef, dimensionsRef ]);

    const handleAction = (key: Key) => {
        if (state.status === "closed") return;

        state
            .sections
            .flatMap(section => section.items)
            .find(item => item.title === key)
            ?.handleAction();

        closeContextMenu();
    };

    return (
        <>
            {state.status === "open" && (
                <Listbox
                    ref={mergedRefs}
                    className="z-50 absolute w-[260px] bg-background border-small border-default-100 rounded-small shadow-medium"
                    style={{
                        top: state.position.y + dimensions.height > document.body.clientHeight ? document.body.clientHeight - dimensions.height : state.position.y,
                        left: state.position.x + dimensions.width > document.body.clientWidth ? document.body.clientWidth - dimensions.width : state.position.x
                    }}
                    variant="flat"
                    aria-label="Context menu"
                    disabledKeys={
                        state
                            .sections
                            .flatMap(section => section.items)
                            .filter(item => item.disabled)
                            .map(item => item.title)
                    }
                    onAction={handleAction}
                >
                    {state.sections.map((section, i) => (
                        <ListboxSection
                            key={section.title}
                            title={section.title}
                            showDivider={i !== state.sections.length - 1}
                        >
                            {section.items.map(item => (
                                <ListboxItem
                                    key={item.title}
                                    className={item.danger ? "text-danger" : undefined}
                                    color={item.danger ? "danger" : undefined}
                                    startContent={item.icon}
                                >
                                    {item.title}
                                </ListboxItem>
                            ))}
                        </ListboxSection>
                    ))}
                </Listbox>
            )}
        </>
    );
};
