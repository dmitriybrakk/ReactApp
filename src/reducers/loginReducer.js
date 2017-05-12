import {CHANGE_EMAIL,CHANGE_PASSWORD,ATTEMPT_LOGIN,LOGIN_SUCCESS,LOGIN_FAILURE} from '../actions/loginActions'

const initialState = {
  email: '',
  password: '',
  isFetching: false,
  message: '',
  errorcode: 0,
  token: '',
}

function loginState(state = initialState, action){
  switch(action.type){
    case CHANGE_EMAIL:
      return {
        ...state, email: action.text
      }
    case CHANGE_PASSWORD:
      return {
        ...state, password: action.text
      }
    case ATTEMPT_LOGIN:
      return {
        ...state,isFetching: true
      }
    case LOGIN_SUCCESS:
      return Object.assign({},state,{
        isFetching: false,
        token: action.token,
      })
    case LOGIN_FAILURE: 
      return Object.assign({},state,{
        isFetching: false,
        message: action.message,
        errorcode: action.errorcode,
        token: '',
        password: ''
        })
    default:
      return state
  }
}

export default loginState