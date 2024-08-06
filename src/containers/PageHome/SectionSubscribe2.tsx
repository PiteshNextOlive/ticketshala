import { FC, useState } from 'react'
import ButtonCircle from "shared/Button/ButtonCircle"; 
import Input from "shared/Input/Input";
import { Service, Storage } from 'services/Service'
import { OpenNotification, checkValidImage } from 'components/Helper'

export interface SectionSubscribe2Props {
  className?: string;
}

const SectionSubscribe2: FC<SectionSubscribe2Props> = ({ className = "" }) => {

  const [buttonDisable, setButtonDisable] = useState(false)
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = () => {

    if (email === "") {
      OpenNotification('error', 'Missing Field!', 'Please enter email to subscribe!', '', false)
      return false
    }
    setLoading(true)
     const params = {
      email: email
    }
    setButtonDisable(true)
    Service.post({
      url: '/data/newsletter',
      body: JSON.stringify(params)
    })
      .then(response => {
        setButtonDisable(false)
        setLoading(false)
        if (response.status === 'error') {
          OpenNotification('error', 'Oops!', response.data.message, '', true)
        } else { 
          OpenNotification('success', 'Success!', 'Thank you for the subscribtion!', '', true)
          setEmail("")
        }
      })
  }

  return (
    <div
      className={`nc-SectionSubscribe2 relative flex items-center justify-center lg:flex-row lg:items-center ${className}`}
      data-nc-id="SectionSubscribe2"
    >
      <div className="flex flex-col items-center justify-between px-5">
        <h2 className="font-semibold text-neutral-100 text-3xl md:text-4xl uppercase">Subscribe to our newsletter</h2>
        <span className="block mt-5 text-neutral-100 dark:text-neutral-400">
          Read and share new perspectives on just about any topic. Everyone’s
          welcome!
        </span>
       
        <form className="mt-10 relative min-w-sm">
          <Input
            aria-required
            placeholder="Enter your email"
            type="email"
            value={email}
            sizeClass="h-14"
            fontClass="text-md"
            onChange={(e) => setEmail(e.target.value)}
          />
          <ButtonCircle
            type="button"
            className="absolute transform top-1/2 -translate-y-1/2 right-1"
            onClick={onSubmit}
          >
            <i className="las la-arrow-right text-xl"></i>
          </ButtonCircle>
        </form>
      </div>
    </div>
  );
};

export default SectionSubscribe2;
