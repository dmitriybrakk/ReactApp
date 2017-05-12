import React, { Component,PropTypes } from 'react';
import Dimensions from 'Dimensions';
import {Actions} from 'react-native-router-flux';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  Linking,
  NetInfo,
  NativeModules
} from 'react-native';
// import {Spinner} from 'native-base';
var windowSize = Dimensions.get('window');
// const API="https://staging.symptoma.com/api/v3/login?apikey=9b5e5c01f2eb86bb3882af9dbab21ca1&username=";
const API_LOGIN ="https://www.symptoma.com/api/v3/login?apikey=rk4sozneoenthrynz28qeaw0feiak0jm&username=";
import Spinner from 'react-native-loading-spinner-overlay'
import ReactNativeI18n from 'react-native-i18n'
const deviceLocale = ReactNativeI18n.locale
import I18n from '../i18n/Localization.js'

class Login extends Component {

constructor(props){
    super(props)
    this.state = {
      blankEmail: false,
      blankPassword: false,
      invalidEmail: false,
      loginError: false,
      loading: true,
      isConnected: true,
      locale: deviceLocale
    }
    I18n.locale = deviceLocale
  }

componentWillMount(){
  AsyncStorage.multiGet(['logged','token'], (callback,stored) =>
  ((stored[0][1] === 'true') ? this.loggedToSearch(stored[1][1]) : this.setState({loading: false})))
}

loggedToSearch(token){
  this.setState({loading: false})
  Actions.search({token: token})
}

//Constantly check if the device is connected to the internet
componentDidMount() {
  const dispatchConnected = isConnected => this.setState({isConnected: isConnected});

    NetInfo.isConnected.fetch().then().done(() => {
    NetInfo.isConnected.addEventListener('change', dispatchConnected);
  });
}

attemptLogin(){
  if (this.props.login.email && this.props.login.password){
      if(this.validateEmail(this.props.login.email)){
        var URL = API_LOGIN+this.props.login.email+"&password="+this.props.login.password
        console.log('LOGIN URL',URL)
        NetInfo.isConnected.fetch().then(isConnected => {
          isConnected ? this.props.submitCredentials(URL).then(() => this.checkIfSuccess()) : this.setState({isConnected: false})
        })
      } else {
        this.setState({invalidEmail: true})
      }
  } else {
    if (this.props.login.email === ""){
       this.setState({blankEmail: true})
    }
    if (this.props.login.password === ""){
      this.setState({blankPassword: true})
    }
  }
}

checkIfSuccess(){
  if (this.props.login.token){
    const token = this.props.login.token
    const email = this.props.login.email
    AsyncStorage.multiSet([['logged','true'],['token',token]])
    Actions.search({token: token, email: email})
  } else {
    this.setState({loginError:true})
  }
}

// <ActivityIndicator animating={this.props.login.isFetching} size='large' style={{alignItems: 'center',justifyContent: 'center'}}/>
// <Image style={styles.bg} source={require('../assets/bg.png')}/>
render(){
  const { locale } = this.state
  if (this.state.loading){
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={true}/>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
          <View style={styles.header}>
              <Image style={styles.logo} source={require('../assets/logo.png')} />
          </View>
          <ActivityIndicator animating={this.props.login.isFetching} size='large' style={{position: 'relative',bottom: 30}}/>
          <View style={styles.inputs}>
              <View style={styles.inputContainer}>
                  <Image style={styles.inputUsername} source={require('../assets/person.png')}/>
                  <TextInput
                      ref='email'
                      autoFocus={true}
                      style={[styles.input,styles.blackFont]}
                      placeholder={I18n.t('email')}
                      keyboardType='email-address'
                      placeholderTextColor="#848484"
                      selectionColor="#009FE3"
                      onChangeText = {(text) => this.props.changeEmail(text)}
                      onSubmitEditing = {() => this.refs.pwd.focus()}
                      value={this.props.login.email}
                      onFocus={() => this.setState({focusEmail: true,focusPassword:false, invalidEmail: false, isConnected: true})}
                      onChange={() => this.dismissErrorOnInputChange()}
                  />
                  {this.renderBlankAlertEmail()}
                  {this.renderBlankErrorTextEmail()}
              </View>
              <View style={styles.inputContainer}>
                  <Image style={styles.inputPassword} source={require('../assets/lock.png')}/>
                   <TextInput
                      password={true}
                      secureTextEntry={true}
                      ref='pwd'
                      style={[styles.input, styles.blackFont]}
                      placeholder={I18n.t('password')}
                      placeholderTextColor="#848484"
                      selectionColor="#009FE3"
                      onChangeText = {(text) => this.props.changePassword(text)}
                      onSubmitEditing={() => dismissKeyboard()}
                      returnKeyLabel='done'
                      value={this.props.login.password}
                      onFocus={() => this.setState({focusPassword: true,focusEmail: false, isConnected: true})}
                      onChange={() => this.dismissErrorOnInputChange()}
                  />
                  {this.renderBlankAlertPassword()}
                  {this.renderBlankErrorTextPassword()}
              </View>
          </View>
          <View>
            <TouchableHighlight
              underlayColor='#35b5ff'
              style={styles.signin}
              onPress={() => this.attemptLogin()}>
                <Text style={{color: '#fff',fontSize: 16}}>{I18n.t('signIn')}</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.signup}>
              <Text style={styles.blackFont}>{I18n.t('noAccountYet')}</Text>
              <View>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.symptoma.com/en/register')}>
                  <Text style={styles.greyFont}>{I18n.t('signUp')}</Text>
                </TouchableOpacity>
              </View>
          </View>
          {this.renderFlag()}
          {this.renderLoginError()}
          {this.renderNoConnection()}
      </View>
    )
    }
  }

  renderFlag(){
    if(this.state.locale == 'de'){
      return (
          <View style={styles.flag}>
            <TouchableOpacity onPress={() => this.changeLocale()}>
              <Image source={require('../assets/flag_en.png')} />
            </TouchableOpacity>
          </View>
        )
    } else {
      return (
          <View style={styles.flag}>
            <TouchableOpacity onPress={() => this.changeLocale()}>
              <Image source={require('../assets/flag_de.png')} />
            </TouchableOpacity>
          </View>
        )
    }
  }

  changeLocale(){
    if (this.state.locale == 'de'){
      this.setState({locale: 'en'})
      I18n.locale = 'en'
    } else {
      this.setState({locale: 'de'})
      I18n.locale = 'de'
    }
  }

  renderLoginError(){
    if (this.state.loginError){
      return (
        <View style={styles.footer}>
          <Text ref='footer' style={styles.footerTitle}>{this.props.login.message}</Text>
        </View>
      )
    }
    setTimeout(() => {this.setState({loginError: false})}, 10000)
  }

  renderNoConnection(){
    if(!this.state.isConnected){
      return (
        <View style={styles.footer}>
          <Text ref='footer' style={styles.footerTitle}>{I18n.t('checkConnection')}</Text>
        </View>
      )
    }
  }

  renderBlankAlertEmail(){
    if (this.state.blankEmail || this.state.invalidEmail){
      return (
        <Image style={styles.alert} source={require('../assets/alert.png')}/>
      )
    }
  }

  renderBlankAlertPassword(){
    if (this.state.blankPassword){
      return (
        <Image style={styles.alert} source={require('../assets/alert.png')}/>
      )
    }
  }

  renderBlankErrorTextEmail(){
    if (this.state.blankEmail && this.state.focusEmail){
      return (
      <View style={styles.alertText}>
        <Text style={styles.whiteFont}>{I18n.t('blank')}</Text>
      </View>
    )
    }
    if (this.state.invalidEmail && this.state.focusEmail){
       return (
      <View style={styles.alertText}>
        <Text style={styles.whiteFont}>{I18n.t('invalidEmail')}</Text>
      </View>
    )
    }
  }

  renderBlankErrorTextPassword(){
    if (this.state.blankPassword && this.state.focusPassword){
      return (
      <View style={styles.alertText}>
        <Text style={styles.whiteFont}>{I18n.t('blank')}</Text>
      </View>
      )
    }
  }

  dismissErrorOnInputChange(){
    if(this.props.login.email.length > -1){
      this.setState({blankEmail: false})
    }
    if (this.props.login.password.length > -1){
      this.setState({blankPassword : false})
    }
  }

  validateEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }
}

var styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    },
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.5,
        backgroundColor: 'transparent'
    },
    flag: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      marginBottom: 15
    },
    logo: {
        width: 190,
        height: 130
    },
    signin: {
        backgroundColor: '#009FE3',
        padding: 20,
        alignItems: 'center'
    },
    signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .2
    },
    inputs: {
        top: -40,
        marginTop: 10,
        marginBottom: 10,
        flex: .2
    },
    inputPassword: {
        tintColor: '#000',
        marginLeft: 15,
        width: 20,
        height: 21,
    },
    inputUsername: {
      tintColor: '#000',
      marginLeft: 15,
      width: 20,
      height: 20
    },
    inputContainer: {
        padding: 10,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent',
        marginTop: 10
    },
    input: {
        position: 'absolute',
        borderColor: "#FFF",
        left: 61,
        top: 2,
        right: 0,
        height: 40,
        fontSize: 16
    },
    greyFont: {
      color: '#585858'
      // color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    },
    blackFont: {
      color: '#000'
    },
    footer: {
      width: 420,
      height: 30,
      backgroundColor: '#e20505',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0
    },
    footerTitle: {
      color: 'white',
      alignItems: 'center',
      justifyContent: 'center'
    },
    alert: {
      position: 'absolute',
      right: 20,
      bottom: 10,
      width: 20,
      height: 20,
      backfaceVisibility: 'visible',
      overflow: 'visible',
      backgroundColor: '#fff'
    },
    alertText: {
      position: 'absolute',
      right: 50,
      bottom: 10,
      backgroundColor: "#1a1a1a",
      width: 200,
      borderWidth: 1,
      borderBottomColor: '#e20505',
      borderColor: 'transparent'
    },
    backOnLoad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    },
    blurView: {
      position: "absolute",
      alignItems: 'center',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0
    },
})

export default Login
