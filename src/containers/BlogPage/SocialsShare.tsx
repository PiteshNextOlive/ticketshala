import React, { FC } from "react";
import config from 'config.json'
import { FacebookShareButton, EmailShareButton, TwitterShareButton, WhatsappShareButton, TelegramShareButton, LinkedinShareButton } from "react-share"
import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon
} from "react-share";

export interface SocialsShareProps {
  className?: string;
  itemClass?: string;
  shareUrl?: any;
  shareTitle?: string;
  mode?: string;
}

export interface SocialType {
  name: string;
  icon: string;
  href: string;
}

const socials: SocialType[] = [
  { name: "Facebook", icon: "lab la-facebook-f", href: "#" },
  { name: "Twitter", icon: "lab la-twitter", href: "#" },
  { name: "Linkedin", icon: "lab la-linkedin-in", href: "#" },
  { name: "Instagram", icon: "lab la-instagram", href: "#" },
];

const SocialsShare: FC<SocialsShareProps> = ({
  className = "grid gap-[6px]",
  itemClass = "w-7 h-7 text-base hover:bg-neutral-100",
  shareTitle,
  shareUrl,
  mode
}) => {
 
  return (
    <div className={`nc-SocialsShare ${(mode === 'single') ? 'flex flex-row space-x-2 ' : className }`} data-nc-id="SocialsShare">
      <div key={1}
        className={`rounded-full leading-none flex items-center justify-center bg-white text-neutral-6000 ${itemClass}`}
        title={`Share on Facebook`}
      >
        <FacebookShareButton url={shareUrl} quote={shareTitle}>
          <FacebookIcon size={30} round={true} />
        </FacebookShareButton>
      </div>
      <div key={2}
        className={`rounded-full leading-none flex items-center justify-center bg-white text-neutral-6000 ${itemClass}`}
        title={`Share on Twitter`}
      >
        <TwitterShareButton url={shareUrl} title={shareTitle}>
          <TwitterIcon size={30} round={true} />
        </TwitterShareButton>
      </div>
      <div key={3}
        className={`rounded-full leading-none flex items-center justify-center bg-white text-neutral-6000 ${itemClass}`}
        title={`Share on Linkedin`}
      >
        <LinkedinShareButton url={shareUrl} title={shareTitle}>
          <LinkedinIcon size={30} round={true} />
        </LinkedinShareButton>
      </div>
      <div key={4}
        className={`rounded-full leading-none flex items-center justify-center bg-white text-neutral-6000 ${itemClass}`}
        title={`Share on Email`}
      >
        <EmailShareButton url={shareUrl} subject={shareTitle} body="body">
            <EmailIcon size={30} round={true} />
          </EmailShareButton>
      </div>

      {(mode === 'single') ?
      <>
        <div key={5}
          className={`rounded-full leading-none flex items-center justify-center bg-white text-neutral-6000 ${itemClass}`}
          title={`Share on Whatsapp`}
        >
          <WhatsappShareButton url={shareUrl} title={shareTitle}>
            <WhatsappIcon size={30} round={true} />
          </WhatsappShareButton>
        </div>
        <div key={5}
          className={`rounded-full leading-none flex items-center justify-center bg-white text-neutral-6000 ${itemClass}`}
          title={`Share on Telegram`}
        >
          <TelegramShareButton url={shareUrl} title={shareTitle}>
            <TelegramIcon size={30} round={true} />
          </TelegramShareButton>
        </div>
      </>
      : null }
    </div>
  );
};

export default SocialsShare;
