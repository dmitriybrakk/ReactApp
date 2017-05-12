export const CHANGE_EMAIL = 'CHANGE_EMAIL'
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD'
export const ATTEMPT_LOGIN = 'ATTEMPT_LOGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

/*
* action creators
*/
export function changeEmail(text){
  return {
    type: CHANGE_EMAIL,
    text
  }
}

export function changePassword(text){
  return {
    type: CHANGE_PASSWORD,
    text
  }
}

export function attemptLogin(){
  return {
    type: ATTEMPT_LOGIN
  }
}

export function loginResponse(json){
  if (json.message === 'success'){
    return {
      type: LOGIN_SUCCESS,
      token: json.results[0].token
    }
  } else {
    return {
    type: LOGIN_FAILURE,
    message: json.message,
    errorcode: json.error
    }
  } 
}

export function submitCredentials(url){
  return dispatch => {
    dispatch(attemptLogin())
      return fetch(url)
        .then(response => response.json())
        .catch(error => console.warn("fetch error: ", error))
        .then((response) => dispatch(loginResponse(response)))
  }
}

