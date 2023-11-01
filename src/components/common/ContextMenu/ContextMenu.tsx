import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { useContextMenu } from "hooks/useContextMenu";
import type { FC, Key } from "react";
import { useCallback } from "react";
import { useCloseEvents } from "../../../hooks/useCloseEvents";
import { useDimensions } from "../../../hooks/useDimensions";
import { ContextMenuWrapper } from "./ContextMenuWrapper/ContextMenuWrapper";

type ContextMenuFC = FC & {
    Wrapper: typeof ContextMenuWrapper;
};

export const ContextMenu: ContextMenuFC = () => {

    const { sections, closeContextMenu, mouse } = useContextMenu();

    const { ref: dimensionsRef, dimensions } = useDimensions();

    const closeRef = useCloseEvents(closeContextMenu);

    const mergedRefs = useCallback((node: HTMLElement) => {
        dimensionsRef(node);
        closeRef.current = node;
    }, [ closeRef, dimensionsRef ]);

    const handleAction = (key: Key) => {
        sections
            .flatMap(section => section.items)
            .find(item => item.title === key)
            ?.handleAction();
        closeContextMenu();
    };

    return (
        <>
            {mouse && (
                <Listbox
                    ref={mergedRefs}
                    className="z-50 absolute w-[260px] bg-background border-small border-default-100 rounded-small shadow-sm"
                    style={{
                        top: mouse.y + (dimensions?.height ?? 0) > document.body.clientHeight ? document.body.clientHeight - (dimensions?.height ?? 0) : mouse.y,
                        left: mouse.x + (dimensions?.width ?? 0) > document.body.clientWidth ? document.body.clientWidth - (dimensions?.width ?? 0) : mouse.x
                    }}
                    variant="flat"
                    aria-label="Context menu"
                    onAction={handleAction}
                >
                    {sections.map((section, i) => (
                        <ListboxSection
                            key={section.title}
                            title={section.title}
                            showDivider={i !== sections.length - 1}
                        >
                            {section.items.map(item => (
                                <ListboxItem
                                    key={item.title}
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

ContextMenu.Wrapper = ContextMenuWrapper;
