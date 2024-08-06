import React, { FC } from "react";
import PhoneInputField from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const PhoneInput = ({ onChange, name, value }) => {

  return (
    <>
      <PhoneInputField
        inputProps={{ placeholder: 'Phone Number', name }}
        value={value}
        onChange={(tel) => { onChange(tel) }}
        country={'bd'}
        inputClass='h-11 px-4 py-3 border-neutral-300 bg-white dark:bg-neutral-900 text-sm rounded-2xl w-full'
        containerClass='mt-1.5 custom-phone-input'
        isValid={(value) => {
          if (typeof value === 'undefined' || value === "") {
            return false
          }
          return true
        }}
      />
    </>
  )
}
export default PhoneInput