import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ControlPanel from '../components/ControlPanel'
import {saveToken, switchLanguage, changeRegion} from '../actions/globalActions'

function mapStateToProps(state) {
  return {
      global: state.global,
  }
}

function mapDispatchToProps(dispatch){
   return {
    saveToken: (token) => dispatch(changeEmail(token)),
    switchLanguage: (lang) => dispatch(switchLanguage(lang)),
    changeRegion: (reg) => dispatch(changeRegion(reg))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanel)
