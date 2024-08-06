import React, { FC, ReactNode, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Service } from 'services/Service' 

const PageTerms: React.FC = () => {
  const [terms, setTerms]: any = useState(null)
  const [searching, setSearching] = useState(false);

  const getData = () => {
    setSearching(true)
    Service.get({
      url: '/cms/page/terms_conditions'
    }).then(response => {
      setSearching(false)
      if (response.data) {
        setTerms(response.data)
      }
    })
  }

  useEffect(() => {
   getData()
  },[])
 
  const noData = () => {
    return (
      <div className='w-full flex flex-col justify-center items-center border border-neutral-200 py-11 px-11 rounded-xl'>
        <h2 className="text-xl mt-2 font-semibold">No Details Found!</h2>
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

  return (<div className="nc-Page404">
    <Helmet>
      <title>Terms and Conditions || Ticketshala.com</title>
    </Helmet>
    <div className="container relative terms-custom pt-5 pb-16 lg:pb-20 lg:pt-20">
     
    {(searching === true) &&
        <div className='flex justify-center items-center'>
          {_renderLoading()}
        </div>
      }

      {(!searching && terms && terms !== null) && <>
        <h2 className="text-3xl !leading-tight font-semibold text-center mt-0 mb-11 text-neutral-900 md:text-4xl xl:text-5xl dark:text-neutral-100">
          {terms.title}
        </h2>
       
        <div dangerouslySetInnerHTML={{ __html: terms.content }}></div>
      </>}

      {(!searching && terms && terms === null) &&
        <>
          {noData()}
        </>
      }

    </div>
  </div>)
};

export default PageTerms;
