import React, { FC, useEffect, useState } from "react";
import WidgetHeading1 from "./WidgetHeading1";
import { Service } from 'services/Service'

export interface WidgetTagsProps {
  className?: string;
  getBlogList?: any;
}

const WidgetTags: FC<WidgetTagsProps> = ({
  className = "bg-neutral-100 dark:bg-neutral-800",
  getBlogList
}) => {

  const [categories, setCategories] = useState([])

  const getCategoryLists = () => {
    const data = {
      page: 1,
      limit: 20,
      type: "blogs",
      order: "asc"
    }
    Service.post({
      url: '/data/categories',
      body: JSON.stringify(data)
    }).then(response => {
      if (response.data && response.data.length > 0) {
        setCategories(response.data)
      }
    })
  }

  useEffect(() => {
    getCategoryLists()
  }, [])

  return (
    <div className={`nc-WidgetTags rounded-3xl overflow-hidden ${className}`}
      data-nc-id="WidgetTags"
    >
      <WidgetHeading1
        title="🏷 Discover more tags"
      />
      <div className="flex flex-wrap p-4 xl:p-5">
        {categories.map((tag: any) => (
          <div className="mr-2 mb-2">
            <div
              className={`nc-Tag inline-block bg-white dark:bg-neutral-800 cursor-pointer text-sm text-neutral-600 py-2 px-3 rounded-lg border border-neutral-100 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
              data-nc-id="Tag"
              onClick={() => getBlogList({page: 1, limit: 20, type: "blogs", category: tag.title, order: "asc"})}
            >
              {`${tag.title}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WidgetTags;
