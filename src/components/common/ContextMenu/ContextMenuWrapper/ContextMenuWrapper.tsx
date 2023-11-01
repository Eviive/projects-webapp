import { useContextMenu } from "hooks/useContextMenu";
import type { FC, MouseEventHandler, PropsWithChildren } from "react";

type Props = {
    className?: string;
};

export const ContextMenuWrapper: FC<PropsWithChildren<Props>> = props => {

    const { sections, setMouse } = useContextMenu();

    const handleContextMenu: MouseEventHandler<HTMLDivElement> = e => {
        if (sections.length === 0) return;

        e.preventDefault();
        setMouse({ x: e.pageX, y: e.pageY });
    };

    return (
        <div className={props.className} onContextMenu={handleContextMenu}>
            {props.children}
        </div>
    );
};
