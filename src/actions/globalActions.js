export const SAVE_TOKEN = 'SAVE_TOKEN'
export const SWITCH_LANGUAGE = 'CHANGE_LANGUAGE'
export const CHANGE_REGION = 'CHANGE_REGION'
export const LOGOUT = 'LOGOUT'

export function saveToken(token){
	return {
		type: SAVE_TOKEN,
		token
	}
}

export function switchLanguage(lang){
	return {
		type: SWITCH_LANGUAGE,
		lang
	}
}

export function changeRegion(reg){
	return {
		type: CHANGE_REGION,
		reg
	}
}

export function logout(){
	return {
		type: LOGOUT,
	}
}
