import {UPDATE_QUERY, GET_SUGGESTIONS} from '../actions/searchActions'

const initialState = {
	query : '',
	symptoms: []
}

function searchState(state=initialState, action){

	switch(action.type){
    case UPDATE_QUERY:
      return {
        ...state, query: action.text
      }
		case GET_SUGGESTIONS:
				return {
					...state, symptoms: actions.symptoms
				}
    default:
      return state
  }
}

export default searchState
