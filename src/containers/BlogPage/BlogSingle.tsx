import React, { FC, Fragment, useState, useEffect } from "react";
import { PostDataType } from "data/types";
import { useParams, useHistory, Link } from 'react-router-dom';
import Avatar from "shared/Avatar/Avatar";
import Badge from "shared/Badge/Badge";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import Comment from "shared/Comment/Comment";
import NcImage from "shared/NcImage/NcImage";
import SocialsShare from "./SocialsShare";
import Textarea from "shared/Textarea/Textarea";
import { Helmet } from "react-helmet";
import { Service } from 'services/Service';
import config from 'config.json'
import moment from "moment";

const BlogSingle = () => {
  const { slug }: any = useParams()
  const history = useHistory()
  const [data, setData]: any = useState(null)
  const [loading, setLoading] = useState(true)

  const [shareTitle, setShareTitle]: any = useState(null)
  const [shareUrl, setShareUrl]: any = useState(null)

  const getBlogData = () => {
    setLoading(true)
    Service.get({ url: `/data/blog//${slug}` })
      .then(response => {
        setLoading(false)
        if (response.status === 'error') {
          return false
        } else {
          setData(response.data)
          setShareTitle(response.datatitle)
          setShareUrl(`${config.SITE_URL}/blog-single/${response.data.slug}`)
        }
      })
  }

  useEffect(() => {
    if (slug) {
      getBlogData()
    }
  }, [slug])

  const renderTags = () => {
    if (data && data.category !== null) {
      const cts = data.category.split(',');
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

  const renderHeader = () => {
    return (
      <header className="container rounded-xl">
        <div className="space-y-5 terms-custom">
          {renderTags()}
          <h1
            className=" text-neutral-900 font-semibold text-3xl md:text-4xl md:!leading-[120%] lg:text-4xl dark:text-neutral-100 max-w-4xl "
            title={data && data.title}
          >
            {data && data.title}
          </h1>

          <div className="block text-base text-neutral-600 md:text-lg dark:text-neutral-400 pb-1" dangerouslySetInnerHTML={{ __html: data && data.short_description }} />
        
          <div className="w-full border-b border-neutral-100 dark:border-neutral-800"></div>
          <div className="flex flex-col items-baseline sm:flex-row sm:justify-between">
             <div className="nc-PostMeta2 flex items-center flex-wrap text-neutral-700 text-left dark:text-neutral-200 text-sm leading-none flex-shrink-0">
              
              <div>
                <div className="flex items-center">
                  <span className="block font-semi">
                    { (data) ? `Blog added on : ${moment(data.date_added).format('lll')}` : null }
                  </span>
                </div>
              </div>
            </div> 
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <SocialsShare shareUrl={shareUrl} shareTitle={shareTitle} mode='single' />
            </div>
          </div>
        </div>
      </header>
    );
  };

  const renderContent = () => {
    return (
      <div id="single-entry-content"
        className="my-10 sm:my-12 dark:prose-dark"
      >
        {data && <div dangerouslySetInnerHTML={{ __html: data.content }}></div>}
      </div>
    );
  };

  const renderAuthor = () => {
    return (
      <div className="max-w-screen-md mx-auto ">
        <div className="nc-SingleAuthor flex">
          <Avatar sizeClass="w-11 h-11 md:w-24 md:h-24" />
          <div className="flex flex-col ml-3 max-w-lg sm:ml-5 space-y-1">
            <span className="text-xs text-neutral-400 uppercase tracking-wider">
              WRITEN BY
            </span>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
              <a href="/ncmaz/author/the-demo-author-slug">Fones Mimi</a>
            </h2>
            <span className="text-sm text-neutral-500 sm:text-base dark:text-neutral-300">
              There’s no stopping the tech giant. Apple now opens its 100th
              store in China.There’s no stopping the tech giant.
              <a
                className="text-primary-6000 font-medium ml-1"
                href="/ncmaz/author/the-demo-author-slug"
              >
                Readmore
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderCommentForm = () => {
    return (
      <div className="max-w-screen-md mx-auto pt-5">
        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
          Responses (14)
        </h3>
        <form className="nc-SingleCommentForm mt-5">
          <Textarea />
          <div className="mt-2 space-x-3">
            <ButtonPrimary>Submit</ButtonPrimary>
            <ButtonSecondary>Cancel</ButtonSecondary>
          </div>
        </form>
      </div>
    );
  };

  const renderCommentLists = () => {
    return (
      <div className="max-w-screen-md mx-auto">
        <ul className="nc-SingleCommentLists space-y-5">
          <li>
            <Comment />
            <ul className="pl-4 mt-5 space-y-5 md:pl-11">
              <li>
                <Comment isSmall />
              </li>
            </ul>
          </li>
          <li>
            <Comment />
            <ul className="pl-4 mt-5 space-y-5 md:pl-11">
              <li>
                <Comment isSmall />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  };

  const renderPostRelated = (post: PostDataType) => {
    return (
      <div
        key={post.id}
        className="relative aspect-w-3 aspect-h-4 rounded-3xl overflow-hidden group"
      >
        <Link to={post.href} />
        <NcImage
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
          src={post.featuredImage}
        />
        <div>
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black"></div>
        </div>
        <div className="flex flex-col justify-end items-start text-xs text-neutral-300 space-y-2.5 p-4">
          <Badge name="Categories" />
          <h2 className="block text-lg font-semibold text-white ">
            <span className="line-clamp-2">{post.title}</span>
          </h2>

          <div className="flex">
            <span className="block text-neutral-200 hover:text-white font-medium truncate">
              {post.author.displayName}
            </span>
            <span className="mx-1.5 font-medium">·</span>
            <span className="font-normal truncate">{post.date}</span>
          </div>
        </div>
        <Link to={post.href} />
      </div>
    );
  };

  return (
    <div className="nc-PageSingleflex terms-custom flex-col items-start pt-8 lg:pt-8">
      <Helmet>
        <title>Blog Detail || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      {renderHeader()}
      <NcImage
        className="w-full rounded-xl"
        containerClassName="container my-10 sm:my-12 "
        src={data && `${config.MEDIA_URL}${data.image}`}
      />

      <div className="nc-SingleContent container space-y-10">
        {renderContent()}
     {/*
        <div className="max-w-screen-md mx-auto border-b border-t border-neutral-100 dark:border-neutral-700"></div>
        {renderAuthor()}
        {renderCommentForm()}
        {renderCommentLists()}*/}
      </div> 
     {/*  <div className="relative bg-neutral-100 dark:bg-neutral-800 py-16 lg:py-28 mt-16 lg:mt-24">
        <div className="container ">
          <h2 className="text-3xl font-semibold">Related posts</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {DEMO_POSTS.filter((_, i) => i < 4).map(renderPostRelated)}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default BlogSingle;
