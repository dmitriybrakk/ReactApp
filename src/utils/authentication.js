import {AsyncStorage} from 'react-native'


const AUTHENTICATION_TOKEN = 'Syptoma:AuthenticationToken';

export function getAuthenticationToken() {
  return AsyncStorage.getItem(AUTHENTICATION_TOKEN);
}

export async function setAuthenticationToken(token) {
  return AsyncStorage.setItem(AUTHENTICATION_TOKEN, token);
}

export async function clearAuthenticationToken() {
  return AsyncStorage.removeItem(AUTHENTICATION_TOKEN);
}