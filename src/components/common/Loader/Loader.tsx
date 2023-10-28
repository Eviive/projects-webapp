import { Spinner } from "@nextui-org/react";
import type { FC } from "react";

export const Loader: FC = () => {
    return (
        <div className="grow grid place-items-center">
            <Spinner size="lg" color="danger" />
        </div>
    );
};
