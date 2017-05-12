export const UPDATE_QUERY = "UPDATE_QUERY"
export const GET_SUGGESTIONS = "GET_SUGGESTIONS"

const API_SUGGESTIONS = 'https://www.symptoma.com/api/v3/symptoms/suggestions?apikey=rk4sozneoenthrynz28qeaw0feiak0jm&token=';

export function updateQuery(text){
  return {
    type: UPDATE_QUERY,
    text
  }
}

export function getSuggestions(suggestions){
  return {
    type: GET_SUGGESTIONS,
    symptoms: suggestions.results.filter(symptom => symptom.label)
  }
}

export function requestSuggestions(url){
  return dispatch => {
      return fetch(url)
        .then(response => response.json())
        .catch(error => console.warn("suggestions error: ", error))
        .then((suggestions) => dispatch(getSuggestions(suggestions)))
  }
}
