import React, { FC, Fragment, useState, useEffect } from "react";
import NcImage from "shared/NcImage/NcImage";
import PostCardMeta from "components/PostCardMeta/PostCardMeta";
import { PostDataType } from "data/types";
import { Link } from "react-router-dom";
import CategoryBadgeList from "components/CategoryBlog/CategoryBadgeList";
import PostTypeFeaturedIcon from "components/PostTypeFeaturedIcon/PostTypeFeaturedIcon";
import config from 'config.json'
import SocialsShare from "./SocialsShare";
import moment from "moment";
import Badge from "shared/Badge/Badge";

export interface Card3Props {
  className?: string;
  post: PostDataType;
}

const Card3 = ({ key, className = "h-full", post }: any) => {
  const { title, href, slug, short_description, image, date_added, featuredImage, desc, category, postType } = post;

  const renderTags = () => {
    if (category && category !== null) {
      const cts = category.split(',');
      return (
        (cts && cts.length > 0) &&
        <>
          {cts.map((item: any, index: any) => (
            <>
              <Badge name={item} className='mr-1' color="blue" />
            </>
          ))}
        </>
      )
    }
  }

  
  const [shareTitle, setShareTitle]: any = useState(null)
  const [shareUrl, setShareUrl]: any = useState(null)

  useEffect(() => {

    setShareTitle(title)
    setShareUrl(`${config.SITE_URL}/blog-single/${slug}`)
  }, [post])

  return (
    <div
      className={`nc-Card3 relative flex flex-col-reverse sm:flex-row sm:items-center border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow group ${className}`}
      data-nc-id="Card3"
    >
      <div className="flex flex-col flex-grow">
        
        <Link to={`/blog-single/${slug}`} className="line-clamp-2" title={title}>
          <div className="space-y-5 mb-6 p-3 sm:p-5">
            {renderTags()}
            <div>
              <h2 className={`nc-card-title block font-semibold text-neutral-900 dark:text-neutral-100 text-xl`} >
                {(title.length > 35) ? title.substring(0, 35) + '...' : title}
              </h2>
              <div className="hidden sm:block sm:mt-2">
                <span className="text-neutral-500 dark:text-neutral-400 text-base line-clamp-1">
                  {short_description}
                </span>
              </div>
            </div>
            <span className="mt-auto text-neutral-500 dark:text-neutral-400 font-normal line-clamp-1">
              {moment(date_added).format('lll')}
            </span>
          </div>
        </Link>
      </div>

      <div
        className={`block flex-shrink-0 sm:w-56 sm:ml-6 rounded-3xl overflow-hidden mb-5 sm:mb-0`}
      >
        <Link to={`/blog-single/${slug}`}
          className={`block w-full h-0 aspect-h-9 sm:aspect-h-16 aspect-w-16 `}
        >
          <NcImage
            containerClassName="absolute inset-0"
            src={`${config.MEDIA_URL}${image}`}
            alt={title}
          />
             <SocialsShare className="absolute hidden md:grid ml-3 gap-[5px] right-4 top-4 opacity-0 z-[-1] group-hover:z-10 group-hover:opacity-100 transition-all duration-300" shareUrl={shareUrl} shareTitle={shareTitle} />
          <span>
            <PostTypeFeaturedIcon
              className="absolute left-2 bottom-2"
              postType={postType}
              wrapSize="w-8 h-8"
              iconSize="w-4 h-4"
            />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Card3;
