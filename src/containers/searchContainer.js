import {connect} from 'react-redux'
import Search from '../components/Search'
import {updateQuery, requestSuggestions} from '../actions/searchActions'

function mapStateToProps(state) {
  return {
      search: state.searchReducer,
      global: state.global
  }
}

function mapDispatchToProps(dispatch){
   return {
     saveToken: (token) => dispatch(saveToken(token)),
     updateQuery: (text) => dispatch(updateQuery(text)),
     requestSuggestions: (url) => dispatch(requestSuggestions(url))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
