import React, { FC } from "react";
import { DEMO_EXPERIENCES_LISTINGS } from "data/listings";
import { ExperiencesDataType } from "data/types";
import Badge from "shared/Badge/Badge";
import moment from "moment";
import { getAirportCity, amountSeparator, getCurrency } from 'components/Helper'
import { FaPlane, FaFly, FaHotel, FaCar, FaUmbrellaBeach } from "react-icons/fa"
import { Link } from 'react-router-dom'

export interface CardHProps {
  className?: string;
  data?: ExperiencesDataType;
}

const DEMO_DATA: ExperiencesDataType = DEMO_EXPERIENCES_LISTINGS[0];

const CardHProps = ({ data }: any) => {

  const renderContent = () => {
    return (
      <div className="flex-grow p-3 sm:p-5 flex flex-col">
        <div className="space-y-2 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              {(data.bookingType === 'flight') &&
                <>
                  <FaPlane size='24' /> <span>Flight</span>
                  <Badge name={`${getAirportCity(data.from)}(${data.from}) - ${getAirportCity(data.to)}(${data.to})`} color="green" />
                  <h2 className="flex text-lg font-medium capitalize">
                    <span className="ml-2 line-clamp-1">{data.pnr}</span>
                  </h2>
                </>
              }
              {(data.bookingType === 'hotel') &&
                <><FaHotel size='24' /> <span>Hotel</span></>
              }
              {(data.bookingType === 'package') &&
                <><FaFly size='24' /> <span>Package</span></>
              }
              {(data.bookingType === 'activity') &&
                <><FaUmbrellaBeach size='24' /> <span>Activity</span></>
              }
              {(data.bookingType === 'transfer') &&
                <>
                  <FaCar size='24' /> <span>Transfer</span>
                  <Badge name={`${data.from} - ${data.to}`} color="green" />
                </>
              }
            </div>
            <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              <span>Booking #: </span>
              <div className="flex items-center">
                <span className="sm:ml-1"> {data.txnId}</span>
              </div>
            </div>
            <div className="flex items-center space-x-8 mt-11">
              <div className="flex items-center space-x-2">
                <i className="las la-clock text-lg mr-1"></i> Booking Created On:
                <span className="text-sm ml-2 text-neutral-500 dark:text-neutral-400">
                  {moment(data.dateAdded).format('ll')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between items-end">
            <div className="text-lg font-semibold text-secondary-700 mb-2">
              <span className='currency-font'>{getCurrency(data.currency)}</span>{amountSeparator(data.amount)}
            </div>
            {(data && data.isExpired === 1) ?
              <Badge color={'red'} className="p-2" name={'Booking Expired'} />
              :
              <>
                <Badge color={(data && data.cStatus === 2) ? 'red' : ((data && data.bStatus === 2 && data.pStatus === 2) ? 'green' : 'yellow')} className="p-2" name={(data && data.cStatus === 2) ? 'Cancelled' : ((data && data.bStatus === 2 && data.pStatus === 2) ? 'Booked' : 'Pending')} />
                {(data && data.cStatus === 1) && <div className="mt-1 text-yellow-800 text-sm"><i className="las la-info-circle mr-1"></i> Cancellation Pending</div>}
              </>
            }

          </div>

        </div>

      </div>
    );
  };

  return (
    <div
      className={`nc-ExperiencesCardH group relative bg-white w-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow`}
      data-nc-id="ExperiencesCardH"
    >

      <Link to={`/order/${data.txnId}`}>
        <div className="md:flex md:flex-row">
          {renderContent()}
        </div>
      </Link>
    </div>
  );
};

export default CardHProps;
