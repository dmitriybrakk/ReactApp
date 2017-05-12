import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Login from '../components/Login'
import {changeEmail,changePassword,attemptLogin,loginResponse,submitCredentials} from '../actions/loginActions'

function mapStateToProps(state) {
  return {
      navigation: state.navReducer,
      login: state.loginReducer,
  }
}

function mapDispatchToProps(dispatch){
   return {
    changeEmail: (text) => dispatch(changeEmail(text)),
    changePassword: (text) => dispatch(changePassword(text)),
    submitCredentials: (url) => dispatch(submitCredentials(url)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)