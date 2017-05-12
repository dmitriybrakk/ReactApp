import {combineReducers} from 'redux'
import global from './global'
import routes from './routes'
import loginReducer from './loginReducer'
import searchReducer from './searchReducer'

const rootReducer = combineReducers({
  global,
  routes,
  loginReducer,
  searchReducer
})

export default rootReducer
