import rootReducer from '../reducers'
import {createStore,applyMiddleware,compose} from 'redux'
import thunk from 'redux-thunk'

export default function configureStore (){
  // const store = createStore(rootReducer)
  const store = createStore(rootReducer,applyMiddleware(thunk))
  // const store = compose(applyMiddleware(thunk))(createStore)(rootReducer)
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
