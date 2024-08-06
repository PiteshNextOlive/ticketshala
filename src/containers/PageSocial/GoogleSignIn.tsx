import { FC, Fragment, useState, useContext } from 'react'
import Config from './../../config.json';
import googleSvg from "images/Google.svg";
import { Service, Storage } from 'services/Service'
import { OpenNotification } from 'components/Helper'
import { useDispatch, useSelector } from 'react-redux'
import { setLoginModalVisible } from 'redux/actions/booking'
import { GoogleLogin } from "react-google-login";
import { useHistory } from "react-router-dom";

const GoogleSignIn = ({ from }: any) => { 

  const dispatch = useDispatch();
  const history = useHistory();
  const googleResponse = (response: any) => {
    dispatch(setLoginModalVisible(false));
    
    if (response && response.profileObj) {
      const res: any = {
        name: response.profileObj.name,
        email: response.profileObj.email,
        google_id: response.profileObj.googleId,
        image: response.profileObj.imageUrl,
        scenario: "SocialSignup"
      };
     
      Service.post({
        url: '/user/socialLogin',
        body: JSON.stringify(res)
      })
        .then(response => {
          if (response.status === 'error') {
            OpenNotification('error', 'Oops!', response.data.message, response, false)
            return false
          }
          if (response.data) {
            Storage.set('auth', response.data.user);
            Storage.setString('token', response.data.token);
            OpenNotification('success', `Welcome, ${response.data.user.name}`, 'You have successfully logged! Now you can start to explore. Enjoy!!', '', true)
          }
        })
        .catch(err => {
          OpenNotification('error', 'Oops!', 'Something went wrong!', '', true)
        })
    }
  }

  return (
    <GoogleLogin
      clientId={Config.GOOGLE_CLIENT_ID}
      render={(renderProps: any) => (
        <span key={`google`} onClick={renderProps.onClick} className="nc-will-change-transform mr-2 cursor-pointer flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]" >
          <img
            className="flex-shrink-0"
            src={googleSvg}
            alt={googleSvg}
          />
          <h3 className="flex-grow text-center ml-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
            {`Google`}
          </h3>
        </span>
      )}
      onSuccess={googleResponse}
      onFailure={googleResponse}
    />
  );
};

export default GoogleSignIn;
