import { Badge } from "components/ui/badge";
import type { FC } from "react";
import { FaHeart } from "react-icons/fa6";

export const ProjectFeaturedBadge: FC = () => {
    return (
        <Badge className="bg-danger/25 text-danger hover:bg-danger/25 p-1.5 focus:ring-0 focus:ring-offset-0 [&>svg]:size-3.5">
            <FaHeart />
        </Badge>
    );
};
