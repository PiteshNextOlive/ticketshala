import React, { FC, useEffect, useState } from "react";
import Heading from "components/Heading/Heading";
import { DEMO_POSTS } from "data/posts";
import { PostDataType } from "data/types";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import WidgetTags from "./WidgetTags";
import WidgetCategories from "./WidgetCategories";
import WidgetPosts from "./WidgetPosts";
import Card3 from "./Card3";
import { Service } from 'services/Service'
import { GrArticle } from "react-icons/gr"

// THIS IS DEMO FOR MAIN DEMO
// OTHER DEMO WILL PASS PROPS
const postsDemo: PostDataType[] = DEMO_POSTS.filter((_, i) => i > 7 && i < 14);
//
export interface SectionLatestPostsProps {
  posts?: PostDataType[];
  className?: string;
  postCardName?: "card3";
}

const SectionLatestPosts: FC<SectionLatestPostsProps> = ({
  posts = postsDemo,
  postCardName = "card3",
  className = "",
}) => {
  const [blogs, setBlog] = useState([])
  const [page, setPage] = useState(1)
  const [searching, setSearching] = useState(false);
  const [prevButton, setPrevButton] = useState(false);
  const [nextBotton, setNextButton] = useState(false);

  const formData: any = {
    page: page,
    order: "desc",
    limit: 10,
    status: 2
  }

  const getLists = (data: any) => {
    setSearching(true)
    Service.post({
      url: '/data/blogs',
      body: JSON.stringify(data)
    }).then(response => {
      setSearching(false)
      if (response.data && response.data.length > 0) {
        setBlog(response.data)
      } else {
        setBlog([])
      }
    })
  }

  useEffect(() => {
    page === 1 ? setPrevButton(true) : setPrevButton(false)
    blogs.length === 10 ? setNextButton(false) : setNextButton(true)
  }, [blogs])

  const getBlogList = (params: any) => {
    setSearching(true)
    getLists(params)
  }

  useEffect(() => {
    getBlogList({
      page: page,
      order: "desc",
      limit: 10,
      status: 2
    })
  }, [])

  const doPrev = () => {
    const currentPage: any = page >= 1 ? 1 : page - 1
    getBlogList({
      page: currentPage,
      order: "desc",
      limit: 10,
      status: 2
    })
    setPage(currentPage)
  }

  const doNext = () => {
    const currentPage: any = page + 1
    getBlogList({
      page: currentPage,
      order: "desc",
      limit: 10,
      status: 2
    })
    setPage(currentPage)
  }

  const renderCard = (post: PostDataType) => {
    switch (postCardName) {
      case "card3":
        return <Card3 key={post.id} className="" post={post} />;

      default:
        return null;
    }
  };

  const noData = () => {
    return (
      <div className='w-full flex flex-col justify-center items-center border border-neutral-200 py-11 px-11 rounded-xl'>
        <GrArticle size="40" className="text-neutral-500" />
        <h2 className="text-xl mt-2 font-semibold">No Articles Found!</h2>
      </div>
    )
  }

  const _renderLoading = () => {
    return (
      <svg
        className="animate-spin -ml-1 mr-3 h-10 w-10"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
  };

  return (
    <div className={`nc-SectionLatestPosts relative ${className}`}>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-3/5 xl:w-2/3 xl:pr-14">
          <Heading desc="Popular articles that Ticketshala recommends for you">Latest Articles</Heading>

          {(searching === true) &&
            <div className='flex items-center justify-center'>
              {_renderLoading()}
            </div>
          }

          {(!searching && blogs && blogs.length > 0) && <>
            <div className={`grid gap-6 md:gap-8 grid-cols-1`}>
              {blogs.map((post) => renderCard(post))}
            </div>
            <div className="flex flex-col mt-12 md:mt-20 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:items-center"
              style={{ justifyContent: 'end' }}>
              <ButtonPrimary className="paginaion-btn" disabled={prevButton} onClick={doPrev}>Prev</ButtonPrimary>
              <ButtonPrimary disabled={nextBotton} onClick={doNext} >Next</ButtonPrimary>
            </div>
          </>}

          {(!searching && blogs && blogs.length === 0) &&
            <>
              {noData()}
            </>
          }

        </div>
        <div className="w-full space-y-7 mt-11 lg:mt-0 lg:w-2/5 lg:pl-10 xl:pl-0 xl:w-1/3 ">
          <WidgetTags getBlogList={getBlogList} />
          {/* <WidgetCategories />
          <WidgetPosts /> */}
        </div>
      </div>
    </div>
  );
};

export default SectionLatestPosts;
