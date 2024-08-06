import { PostDataType } from "data/types";
import React, { FC } from "react";
import Badge from "shared/Badge/Badge";

export interface CategoryBadgeListProps {
  className?: string;
  itemClass?: string;
  categories: PostDataType["categories"];
}

const CategoryBadgeList = ({
  className = "flex flex-wrap space-x-2",
  itemClass,
  categories,
}: any) => {
  return (
    <div
      className={`nc-CategoryBadgeList ${className}`}
      data-nc-id="CategoryBadgeList"
    >
        <Badge
          className={itemClass}
          key={categories}
          name={categories}
          href={categories}
          color={"indigo" as any}
        />
    </div>
  );
};

export default CategoryBadgeList;
