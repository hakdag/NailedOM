import Router from 'next/router';
import axios from 'axios';
import { AUTHENTICATE, DEAUTHENTICATE } from '../types';
import { API } from '../../config';
import { setCookie, removeCookie } from '../../utils/cookie';

// gets token from the api and stores it in the redux store and in cookie
const authenticate = ({ email, password }, type, action) => {
  if (type !== 'user' || (action !== 'signin' && action !== 'signup')) {
    throw new Error('Wrong API call!');
  }
  return (dispatch) => {
    axios.post(`${API}/${type}/${action}`, { email, password })
      .then((response) => {
        setCookie('token', response.data.token);
        dispatch({type: AUTHENTICATE, payload: response.data.token});
        if (response.data.role === 'Admin') {
          Router.push('/admin/dashboard');
        } else {
          Router.push('/whoami');
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };
};

// gets the token from the cookie and saves it in the store
const reauthenticate = (token) => {
  return (dispatch) => {
    dispatch({type: AUTHENTICATE, payload: token});
  };
};

// removing the token
const deauthenticate = () => {
  return (dispatch) => {
    removeCookie('token');
    Router.push('/');
    dispatch({type: DEAUTHENTICATE});
  };
};


export default {
  authenticate,
  reauthenticate,
  deauthenticate,
};
