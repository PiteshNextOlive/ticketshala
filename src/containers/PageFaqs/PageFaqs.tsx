import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Service } from 'services/Service'
import NcImage from "shared/NcImage/NcImage";
import config from 'config.json'

const Page404: React.FC = () => {
  const [about, setAbout]: any = useState([])
  const [searching, setSearching] = useState(false);

  const getData = () => {
    setSearching(true)
    Service.get({
      url: '/cms/faq/public_site_FAQ'
    }).then(response => {
      setSearching(false)
      if (response.data) {
        setAbout(response.data)
      }
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const noData = () => {
    return (
      <div className='w-full flex flex-col justify-center items-center border border-neutral-200 py-11 px-11 rounded-xl'>
        <h2 className="text-xl mt-2 font-semibold">No Details Found!</h2>
      </div>
    )
  }

  const renderContent = () => {
    return about.map((item: any) => {
      return (
        <>
          <div>
            <h4 className="text-md font-semibold">{item.question}</h4>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              <div dangerouslySetInnerHTML={{ __html: item.answer.replace(/<\/?[^>]+(>|$)/g, "") }}></div>
            </span>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
        </>
      )
    })
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
    <div className="nc-Page404">
      <Helmet>
        <title>FAQs || Ticketshala.com</title>
      </Helmet>
      <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-20">

        {(searching === true) &&
          <div className='flex items-center justify-center'>
            {_renderLoading()}
          </div>
        }

        {(!searching && about && about.length > 0) && <>
          <div className="listingSection__wrap">
            {/* HEADING */}
            <h2 className="text-2xl font-semibold">FAQs</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
            {renderContent()}
          </div>
        </>}

        {(!searching && about && about.length === 0) &&
          <>
            {noData()}
          </>
        }
      </div>
    </div>
  )
};

export default Page404;
