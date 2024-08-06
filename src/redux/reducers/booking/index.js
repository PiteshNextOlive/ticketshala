// ** Initial State
const initialState = {
    flightList: [],
    isFetching: false,
    flightInfo: null,
    debugInfo: null,
    hotelInfo: null,
    searchParams: null,
    seatQty: [],
    allCategories: [],
    openLoginModal: false,
    logoutStatus: false,
    activityInfo: null,
}

const booking = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_FLIGHT_SEARCH':
            return { ...state, flightList: action.payload, searchParams: action.search, isFetching: action.fetching }
        case 'GET_FLIGHT_VALIDATE':
            return { ...state, flightInfo: action.payload, debugInfo: action.debugInfo, flightList: [], isFetching: action.fetching, seatQty: action.seat }
        case 'OPEN_LOGIN_MODAL':
            return { ...state, openLoginModal: action.payload }
        case 'SET_LOGOUT_STATUS':
            return { ...state, logoutStatus: action.payload }
        case 'GET_CATEGORIES':
            return { ...state, allCategories: action.payload }
        case 'GET_HOTEL_VALIDATE':
            return { ...state, hotelInfo: action.payload, isFetching: action.fetching }
        case 'GET_ACTIVITY_VALIDATE':
            return { ...state, activityInfo: action.payload, isFetching: action.isFetching }
        default:
            return { ...state }
    }
}

export default booking