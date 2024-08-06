import { FC, Fragment, useState, useEffect } from 'react'
import { Collapse } from 'reactstrap'

const MoreInfo = (props: any) => {
 
  const [collapse, setCollapse] = useState(false)
  const [debugInfo, setDebugInfo] = useState(props.debuginfo)

  useEffect(() => {
    if (props && props.response.debuginfo) {
      setDebugInfo(props.response.debuginfo)
    }
  }, [])

  

    return (
      <div>
        <p color='info' onClick={()=> { setCollapse(!collapse)}} className='text-primary mt-2'> More info </p>
        <Collapse isOpen={collapse}>
         {
            (debugInfo && debugInfo.supplier === 'sabre') && 
              <div className='mt-5'>
                <span className='text-danger'>Errors:</span>
                    <ul style={{ paddingLeft: '17px' }}>
                      {
                          debugInfo.error.map((item: any, index: any) => (
                            <>
                              <li key={index}>{item.content}</li>
                            </>
                          ))
                      }
                    </ul>
                  <span className='text-warning'>Warnings:</span>
                    <ul style={{ paddingLeft: '17px' }}>
                      {
                        debugInfo.warning.map((item: any, index: any) => (
                          <>
                            <li key={index}>{item.content}</li>
                          </>
                        ))
                      }
                    </ul>
              </div>
          }
        </Collapse>
      </div>
    )
}

export default MoreInfo