import { useEffect } from "react";
import { useLocation } from "react-router-dom"
import ReactGA from 'react-ga'
ReactGA.initialize('UA-221280050-1'); //UA-221280050-1 //UA-221281399-1

const TrackView = () => {

  const location = useLocation()
 
  useEffect(() => {
    ReactGA.pageview(location.pathname)
  }, [location])

  return null;
};

export default TrackView;
