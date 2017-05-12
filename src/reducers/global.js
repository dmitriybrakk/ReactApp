import {SAVE_TOKEN, SWITCH_LANGUAGE, CHANGE_REGION, LOGOUT} from '../actions/globalActions'

const initialState = {
	token: '',
	lang: '',
	reg: '',
}

function globalState(state=initialState,action){
	switch(action.type){
		case SAVE_TOKEN:
			return {
				...state, token: action.token
			}
		case SWITCH_LANGUAGE:
			return {
				...state, lang: action.lang
			}
		case CHANGE_REGION:
			return {
				...state, reg: action.reg
			}
		default:
			return state
	}
}

export default globalState
