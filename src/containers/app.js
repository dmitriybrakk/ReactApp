import React, { Component } from 'react';
import {Text, StyleSheet, View } from 'react-native';
import { Router, Scene, Actions, ActionConst } from 'react-native-router-flux';
import {Provider,connect} from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers/index'
import configureStore from '../store/configureStore'
const store = configureStore()
const RouterWithRedux = connect()(Router)

import {Icon, Button} from 'native-base'

// New Imports
import Login from '../containers/loginContainer'
import Search from '../containers/searchContainer'
import Results from '../components/Results'
import Details from '../components/Details'

// <Text style={{color: selected ? 'red' :'black'}}>{title}</Text>
// Simple component to render something in place of icon
const TabIcon = ({ selected, title }) => {
  switch(title){
    case "Search":
      return (
        <Icon name='ios-search' style={{color: selected ? 'red' :'white'}} />
      )
    case "History":
      return (
        <Icon name='ios-book' style={{color: selected ? 'red' :'white'}} />
      )
    case "Settings":
      return (
        <Icon name='ios-settings' style={{color: selected ? 'red' :'white'}} />
      )
  }
}

const backButton = () => {return (<Icon name='ios-arrow-back' style={{color: '#ffffff', height: 20}}/>)}

// const NavBar = () => {
//     return (
//       <View style={{heigh}}>
//     )
// }

// title='symptoma' backButtonImage={backButton}

const App = () => {
  return (
    <Provider store={store}>
    <RouterWithRedux>
    <Scene key="root">
      <Scene key="login" component={Login} hideNavBar={true} panHandlers={null} type={ActionConst.REPLACE}/>
      <Scene key="search" component={Search} panHandlers={null} hideNavBar={true} />
      <Scene key="results" component={Results} hideNavBar={true} />
      <Scene key="details" component={Details} hideNavBar={true}/>
    </Scene>
    </RouterWithRedux>
    </Provider>
  )
}

export default App


// App with tabs!
// <Scene key="root">
//   <Scene key="login" component={Login} hideNavBar={true} />
//
//   {/* Tab Container */}
//   <Scene key="main" panHandlers={null} tabs={true} tabBarStyle={{ backgroundColor: '#333A44'}}>
//
//     {/* Search, Results, Details tab */}
//     <Scene key="searchContainer" title="Search" icon={TabIcon} hideNavBar={true} panHandlers={null}>
//       <Scene key="search" component={Search} panHandlers={null} type={ActionConst.REPLACE}/>
//       <Scene key="results" component={Results}/>
//       <Scene key="details" component={Details}/>
//     </Scene>
//
//     {/* History */}
//     <Scene key="history" title="History" icon={TabIcon} hideNavBar={true}>
//       <Scene key="blue" component={BlueScreen} title="History"/>
//     </Scene>
//
//     {/* Settings */}
//     <Scene key="settings" title="Settings" icon={TabIcon} hideNavBar={true}>
//       <Scene key="settings_main" component={Settings}  hideNavBar={true} />
//     </Scene>
//   </Scene>
// </Scene>
