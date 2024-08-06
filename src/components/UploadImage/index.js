import { FC, Fragment, useState as UseState, useCallback as UseCallback, useRef as UseRef, useEffect as UseEffect, useEffect } from 'react'
import 'react-image-crop/dist/ReactCrop.css'
import Config from 'config.json'
import { OpenNotification } from 'components/Helper'

const UploadImage = (props) => {

  const [imgSrc, setImgSrc] = UseState("")
  const [imgPath, setImgPath] = UseState(null)

  UseEffect(() => {

    if (props && props.attachment && props.attachment[props.index]) {
      setImgPath(props.attachment[props.index])
    }
  }, [props])

  const onSelectFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result))
      reader.readAsDataURL(e.target.files[0])
      const response = e.target.files[0]
      const blobToFile = new File([response], response.name, { type: response.type })
      const form = new FormData()
      form.append('file', blobToFile)
      const token = localStorage.getItem("token")
      const header = {
        "x-access-token": token
      }

      const result = await fetch(`${Config.BASE_URL}/fileUpload`, {
        method: 'POST',
        headers: header,
        body: form
      })
      if (result) {
        const response = await result.json()
        if (response.status === 'success') {
          props.handleImgUrl(response.data.filePath, props.label, props.pax, props.index)

          setImgPath(response.data.filePath)

        } else {
          if (response.error && response.error === 'Invalid access Token') {
            OpenNotification('error', 'Oops!', 'Please login to continue booking!')
            return false
          }
          OpenNotification('error', 'Oops!', response.data ? response.data.message : 'Upload Failed!')
        }
      }
    }
  }


  return (
    <Fragment>
      <div className='mt-1'>
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 bg-white dark:border-neutral-6000 border-dashed rounded-md">
          <div className="space-y-1">
            <div className="flex justify-center text-sm text-neutral-6000 dark:text-neutral-300">
              <label className="relative cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                <span><strong>Upload</strong> {props.label}</span>
                <input type="file" className="sr-only" accept="image/*" name='customFile' onChange={onSelectFile} />
              </label>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Allowed Formats: PNG or JPG</p>
          </div>
        </div>

        {
          (imgPath !== null && imgPath !== false) && <div md='12' className='mt-2'>
            <img src={`${Config.MEDIA_URL}${imgPath}`} className="img-fluid" />
          </div>
        }
      </div>
    </Fragment>
  )
}
export default UploadImage