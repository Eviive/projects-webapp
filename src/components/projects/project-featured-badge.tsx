import { Badge } from "components/ui/badge";
import type { FC } from "react";
import { FaHeart } from "react-icons/fa6";

export const ProjectFeaturedBadge: FC = () => {
    return (
        <Badge className="bg-danger/25 p-1.5 text-danger hover:bg-danger/25 focus:ring-0 focus:ring-offset-0">
            <FaHeart size={14} />
        </Badge>
    );
};
