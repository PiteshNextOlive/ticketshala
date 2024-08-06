import { Service } from 'services/Service'

export const getFlightSearch = (params) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_FLIGHT_SEARCH', payload: [], fetching: true, search: params })
  
    await Service.post({ url: '/flight', body: JSON.stringify(params) })
      .then((response) => {
        if (response) {
          dispatch({
            type: 'GET_FLIGHT_SEARCH',
            payload: response.data,
            fetching: false
          })
        }
      })
  }
}

export const getFlightValidate = (params) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_FLIGHT_VALIDATE', payload: [], seat: params.seatQty })

    await Service.post({ url: '/flight/validate', body: JSON.stringify(params) })
      .then((response) => {
        if (response && response.status === 'error') {
          dispatch({
            type: 'GET_FLIGHT_VALIDATE',
            payload: null,
            debugInfo: null
          })
        } else{
          dispatch({
            type: 'GET_FLIGHT_VALIDATE',
            payload: response.data,
            debugInfo : response && response.debuginfo ? response.debuginfo : null
          })
        }
      })
  }
}

export const setLoginModalVisible = (bool) => {
  return { type: 'OPEN_LOGIN_MODAL', payload: bool };
};

export const setLogoutStatus = (bool) => {
  return { type: 'SET_LOGOUT_STATUS', payload: bool };
};

export const getAllCategories = (param) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_CATEGORIES', payload: null, isFetching: true })

    await Service.post({ url: `/data/categories`, body: JSON.stringify(param) })
      .then((response) => {
        if (response) {
          dispatch({
            type: 'GET_CATEGORIES',
            payload: response.data,
            isFetching: false
          })
        }
      })
  }
}

export const getHotelValidate = (params) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_HOTEL_VALIDATE', payload: [], isFetching: true })

    await Service.post({ url: '/hotels/validate', body: JSON.stringify(params) })
    .then((response) => {
      if (response) {
        dispatch({
          type: 'GET_HOTEL_VALIDATE',
          payload: response.data,
          isFetching: false
        })
      }
    })
  }
}

export const getActivityValidate = (params) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_ACTIVITY_VALIDATE', payload: [], isFetching: true })

    await Service.post({ url: '/activities/revalidate', body: JSON.stringify(params) })
      .then((response) => {
        if (response && response.status === 'error') {
          dispatch({
            type: 'GET_ACTIVITY_VALIDATE',
            payload: null,
            debugInfo: null,
            isFetching: false
          })
        } else{
          dispatch({
            type: 'GET_ACTIVITY_VALIDATE',
            payload: response.data,
            debugInfo : response && response.debuginfo ? response.debuginfo : null,
            isFetching: false
          })
        }
      })
  }
}
