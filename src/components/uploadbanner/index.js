import { FC, Fragment, useState as UseState, useCallback as UseCallback, useRef as UseRef, useEffect as UseEffect, useEffect  } from 'react'
import { Input, Row, Col, Label, Button, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap'
import { Dialog, Transition } from "@headlessui/react";
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Config from 'config.json'
import { OpenNotification } from 'components/Helper'
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonClose from "shared/ButtonClose/ButtonClose";

const uploadBanner = (props) => {
  const imgRef = UseRef(null)
  const previewCanvasRef = UseRef(null)
  const [crop, setCrop] = UseState("")
  const [imgSrc, setImgSrc] = UseState("")
  const [completedCrop, setCompletedCrop] = UseState(null)
  const [imgObject, setImgObject] = UseState(null)
  const [imgPath, setImgPath] = UseState(props.imgPath)
  const [buttonDisable, setButtonDisable] = UseState(false)
  const [cropModal, setCropModal] = UseState(false)

  UseEffect(() => {
    setCrop(props.aspectRatio)
    setImgPath(props.imgPath)
  }, [props])

  const getBlobFromCanvas = (canvas, file) => new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        blob.name = file.name
        blob.lastModified = file.lastModified
        resolve(blob)
        // const previewUrl = window.URL.createObjectURL(blob)
        // console.log(previewUrl)
      } else {
        reject(new Error("Canvas is empty"))
      }
    }, file.type) //"image/jpeg");
  })

  const finishCrop = async (canvas, crop) => {
    setButtonDisable(true)
    if (!crop || !canvas) {
      return
    }
    const response = await getBlobFromCanvas(canvas, imgObject)
    const blobToFile = new File([response], response.name, { type: response.type })
    const form = new FormData()
    form.append('file', blobToFile)
    const token = localStorage.getItem("token")
    const header = {
      "x-access-token": token
    }

    if (props.type) {
      form.append('type', props.type)
      form.append("gallery", true)

      if (props.refId) {
        form.append("refId", props.refId)
      }
    } 

    const result = await fetch(`${Config.BASE_URL}/fileUpload`, {
      method: 'POST',
      headers: header,
      body: form
    })
    if (result) {
      const response = await result.json()
      if (response.status === 'success') {
        setButtonDisable(false)
        setCropModal(!cropModal)
        props.handleImgUrl(response.data.filePath)
        if (typeof props.type === undefined) {
          setImgPath(response.data.filePath)
        }
        
        // props.handleImgUrl('files/1630913152929-banner-4.jpg') files/1631547974546-hdflight.jpg
        // setImgPath('files/1630913152929-banner-4.jpg')
      } else {
        setButtonDisable(false)
        OpenNotification('error', 'Oops!', response.data ? response.data.message : 'Upload Failed!')
      }
    }
  }

  const cancelUpload = () => {
    setCropModal(!cropModal)
    setCompletedCrop(null)
    setImgPath(false)
    props.handleImgUrl(false)
    setImgObject(null)
  }

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result))
      reader.readAsDataURL(e.target.files[0])
      setImgObject(e.target.files[0])
      setCropModal(!cropModal)
    }
  }

  const onLoad = UseCallback((img) => {
    imgRef.current = img
  }, [])

  UseEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = previewCanvasRef.current
    const crop = completedCrop

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')
    const pixelRatio = window.devicePixelRatio

    canvas.width = crop.width * pixelRatio * scaleX
    canvas.height = crop.height * pixelRatio * scaleY

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    )
  }, [completedCrop])

  return (
    <Fragment>
     <input type='file'  id='exampleCustomFileBrowser' className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" name='customFile' onChange={onSelectFile} /> 
   
      <Transition appear show={cropModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={cancelUpload}
        >
          <div className="px-4 text-center">
          <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>
    
            <Dialog.Description className="text-xl m-2">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className='nc-PageLogin inline-flex flex-col w-full max-w-xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full'>
                <div className="container auth-section" style={{marginBottom:'2rem'}}>
                  <h4 className="my-10 flex items-center text-3xl leading-[115%] md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
                    Crop and Upload
                  </h4>
                  <span className="absolute right-3 top-4">
                      <ButtonClose onClick={cancelUpload} />
                    </span>
                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                    <ReactCrop
                      src={imgSrc}
                      onImageLoaded={onLoad}
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      locked={true}
                    />
                    <div style={{ display: 'none' }}>
                      <canvas
                        ref={previewCanvasRef}
                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                        style={{
                          width: Math.round(completedCrop?.width ?? 0),
                          height: Math.round(completedCrop?.height ?? 0)
                        }}
                      />
                    </div>
                    </div>
                    <div className="relative text-center">
                        <ButtonPrimary className='paginaion-btn mr-2' color='primary' onClick={() => finishCrop(previewCanvasRef.current, completedCrop)} disabled={buttonDisable}>
                          {(buttonDisable) ? 'Uploading...' : 'Upload'}
                        </ButtonPrimary>
                        <ButtonPrimary className='ml-2 btn-cancel' onClick={cancelUpload}>
                          Cancel
                        </ButtonPrimary>
                    </div>
                  </div>
                </div>
              </div>
              </Transition.Child>
            </Dialog.Description>
          </div>
        </Dialog>
      </Transition>

    </Fragment>
  )
}
export default uploadBanner