import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import Badge from "shared/Badge/Badge";

const SocialTags = ({ tags }: any) => {

  const inputRef = React.createRef<HTMLInputElement>();

  const renderTags = () => {
    if (tags && tags !== null) {
      const tag = tags.split(',');
      return (
        (tag && tag.length > 0) &&
        <>
          {tag.map((item: any, index: any) => (
            <>
              <Badge name={item} color='green' className="mb-2 ml-2" />
            </>
          ))}
        </>
      )
    }
  }

  return (
    <div className="flow-root">
      <div className="flex text-neutral-700 dark:text-neutral-300 text-sm -mx-3 -my-1.5">
      <Popover className="relative">
        {({ open }) => {
          if (open) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 100);
          }

          return (
            <>
              <Popover.Button>
                
                <span className="py-1.5 px-3 flex rounded-lg tag-pkg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-800 cursor-pointer ml-2">
                  <i className="las la-hashtag text-info text-xl"></i>
                  <span className="hidden sm:block ml-2.5">Tags</span>
                </span>
                
              </Popover.Button>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel
                  static
                  className="absolute bg-white right-0 z-10 w-56 mt-3 text-md text-left share-section"
                >
                  {renderTags()}
                </Popover.Panel>
              </Transition>
            </>
          );
        }}
      </Popover>
        
        <span className="hidden py-1.5 px-3 flex rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="hidden sm:block ml-2.5">Save</span>
        </span>
      </div>
    </div>
  );
};

export default SocialTags;
