import { FC, Fragment, useState, useContext } from 'react'
import Config from './../../config.json';
import facebookSvg from "images/Facebook.svg";
import { Service, Storage } from 'services/Service'
import { OpenNotification } from 'components/Helper'
import { useDispatch, useSelector } from 'react-redux'
import { setLoginModalVisible, setLogoutStatus } from 'redux/actions/booking'
import { useHistory } from "react-router-dom";

const FacebookLogin = require('react-facebook-login/dist/facebook-login-render-props').default;

const FacebookSignIn = ({ operation }: any) => {
  
  const dispatch = useDispatch();
  const history = useHistory();
  const responseFacebook = (response: any) => {
    dispatch(setLoginModalVisible(false));
    
    if (response && response.id) {
      const res: any = {
        name: response.name,
        email: response.email,
        facebook_id: response.id,
        image: response.picture.data.url,
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
    <FacebookLogin
      appId={Config.FACEBOOK_APP_ID}
      fields="name,email,picture"
      callback={responseFacebook}
      render={(renderProps: any) => (
        <span key={`facebook`} onClick={renderProps.onClick} className="nc-will-change-transform mr-2 cursor-pointer flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]" >
          <img
            className="flex-shrink-0"
            src={facebookSvg}
            alt={facebookSvg}
          />
          <h3 className="flex-grow text-center ml-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
            {`Facebook`}
          </h3>
        </span>
      )}
    />
  );
};

export default FacebookSignIn;
