import React, { Component } from 'react';
import dismissKeyboard from 'dismissKeyboard';
import {Actions} from 'react-native-router-flux'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ToolbarAndroid,
  ListView,
  AsyncStorage,
  TouchableHighlight,
  Navigator,
  Platform,
  Image,
  Picker,
  NetInfo
} from 'react-native'
import Autocomplete from './Autocomplete'
import {SideMenu} from 'react-native-elements'
import { Container, Header, Title, Content, Button, Icon, List, ListItem, Radio, Text, InputGroup, Input, Footer} from 'native-base'
import { SegmentedControls } from 'react-native-radio-buttons'
import Drawer from 'react-native-drawer'
import ControlPanel from './ControlPanel'
import Spinner from 'react-native-loading-spinner-overlay'
import * as Animatable from 'react-native-animatable'
import TextField from 'react-native-md-textinput';
import I18n from '../i18n/Localization.js'

const API_SEARCH="https://www.symptoma.com/api/v3/search?apikey=rk4sozneoenthrynz28qeaw0feiak0jm&token="
const API_LOGOUT="https://www.symptoma.com/api/v3/logout?apikey=rk4sozneoenthrynz28qeaw0feiak0jm&token="

class Search extends Component{

constructor(props){
    super(props)
    this.state = {
      tags: [],
      selectedOption: 'Geschlecht',
      gender: '',
      year: '',
      emptySymptom: false,
      repeatedSymptom: false,
      improperYear: false,
      loading: false,
      isConnected: true,
      locale: 'de',
      region: ''
    }
}

componentDidMount(){
  const dispatchConnected = isConnected => this.setState({isConnected: isConnected});

    NetInfo.isConnected.fetch().then().done(() => {
    NetInfo.isConnected.addEventListener('change', dispatchConnected);
  });
}

openControlPanel = () => {
    this._drawer.open()
}

async fetchResults(){
  var queryParams = this.state.tags
  var url = API_SEARCH+this.props.token+"&query="
  for (var i=0;i<queryParams.length;i++){
    if (queryParams[i].indexOf(' ') >= 0){
      url = url + queryParams[i].split(' ').join('+') + "%2B"
    } else {
        url = url + queryParams[i] +  "%2B"
    }
  }
  url = url + "&gender=" + this.state.gender + "&birthyear=" + this.state.year + "&region=" + this.state.region + "&lang=" + this.state.locale
  console.log("Search url " + url)
  const response = await fetch(url)
  const json = await response.json()
    // fetch(url).then(res => res.json()).then(json => )
  await this.setState({loading: false})
  Actions.results({results : json.results, token: this.props.token, input: this.state.tags, locale: this.state.locale})
}

goSearch(){
  var year = this.state.year
  this.setState({loading: true})
  if (this.state.tags.length === 0){
    this.setState({loading: false, emptySymptom: true})
  } else if (this.state.year){
      if((year.length != 0 && year.length < 4 ) || year.match(/[^$,.\d]/)){
        this.setState({loading: false, improperYear: true})
      } else {
        this.fetchResults().done()
      }
  }
   else {
    this.fetchResults().done()
  }
}

render(){
  const options = [
    I18n.t('gender'),
    I18n.t('birthyear')
  ];

  function setSelectedOption(selectedOption){
    this.setState({
      selectedOption
    });
  }

    return (
            <Drawer
              type="overlay"
              ref={(ref) => this._drawer = ref}
              content={ <ControlPanel logout={this.logout.bind(this)} locale={this.state.locale} changeLocale={this.changeLocale.bind(this)} region={this.state.region} changeRegion={this.changeRegion.bind(this)} mail={this.props.email} />}
              tapToClose={true}
              openDrawerOffset={0.2} // 20% gap on the right side of drawer
              panCloseMask={0.2}
              closedDrawerOffset={-3}
              styles={drawerStyles}
              tweenHandler={(ratio) => ({
              main: { opacity:(2-ratio)/2 } })}>

              <Container keyboardShouldPersistTaps="always">
                  <Header backgroundColor="#333A44" alignItems='center'>
                  <Button transparent onPress={() => this.openControlPanel()}>
                          <Icon name='ios-menu' style={{color: '#ffffff'}}/>
                      </Button>
                      <Title style={{color: '#fff'}}>symptoma</Title>
                      <Button transparent onPress={() => this.goSearch()}>
                        <Icon name='ios-search' style={{color: '#ffffff'}}/>
                      </Button>
                  </Header>

                  <Content>
                  <View style={{marginLeft: 5, marginRight: 5, marginTop: 5,}}>
                    <View>
                      <Autocomplete
                          blurOnSubmit={true}
                          onFocus={() => this.setState({emptySymptom: false})}
                          onChange={(newTags) => this.setState({tags: newTags})}
                          token={this.props.token}
                          lang={this.state.locale}
                          placeholder={I18n.t('enterSymptoms')}
                       />
                    </View>
                    <View style={{flex: 0.3, alignItems: 'center',marginTop: 5}}>
                        <SegmentedControls
                          containerStyle={{borderRadius: 5, flex: 1}}
                          tint= {'#009fe3'}
                          selectedTint= {'white'}
                          backTint= {'white'}
                          options={ options }
                          allowFontScaling={ false } // default: true
                          onSelection={ setSelectedOption.bind(this) }
                          selectedOption={ this.state.selectedOption }
                        />
                    </View>
                    {this.renderOptionNode()}
                    <View style={{ flex: 1 }}>
                        <Spinner visible={this.state.loading}/>
                    </View>

                    <Button block style={{backgroundColor: '#009fe3', marginTop: 20}} textStyle={{color: '#fff'}} onPress={() => this.goSearch()}>
                      <Text style={{color: '#fff'}}>{I18n.t('search')}</Text>
                    </Button>
                  </View>
                  </Content>
                  {this.renderError()}
              </Container>
              </Drawer>
        )
}

changeLocale(value){
  this.setState({locale: value})
  I18n.locale = value
}

changeRegion(value){
  this.setState({region: value})
}

  renderGenderSelection(){
    if (this.state.gender === 'm'){
      return (
        <List>
          <ListItem>
          <Radio selected={true} />
              <Text>{I18n.t('male')}</Text>
          </ListItem>
          <ListItem>
            <Radio selected={false} onPress={() => this.setState({gender: 'f'})}/>
                <Text>{I18n.t('female')}</Text>
          </ListItem>
        </List>
      )
    } else if (this.state.gender === 'f'){
      return (
        <List>
          <ListItem>
          <Radio selected={false} onPress={() => this.setState({gender: 'm'})} />
              <Text>{I18n.t('male')}</Text>
          </ListItem>
          <ListItem>
            <Radio selected={true} />
                <Text>{I18n.t('female')}</Text>
          </ListItem>
        </List>
      )
    } else {
      return (
        <List>
          <ListItem>
          <Radio selected={false} onPress={() => this.setState({gender: 'm'})} />
              <Text>{I18n.t('male')}</Text>
          </ListItem>
          <ListItem>
            <Radio selected={false} onPress={() => this.setState({gender: 'f'})}/>
                <Text>{I18n.t('female')}</Text>
          </ListItem>
        </List>
      )
    }
  }

  renderOptionNode(){
    if (this.state.selectedOption == 'Gender' || this.state.selectedOption == 'Geschlecht'){
      return (
        <View style={{flex: 1,marginRight: 10}}>
            {this.renderGenderSelection()}
        </View>
      )
    } else {
        return (
          <View style={{flex: 1, alignItems: 'center', marginRight: 10}}>
            <TextField
              keyboardType={'numeric'}
              style={{width: 150, height: 40}}
              label={I18n.t('birthyear')}
              onSubmitEditing={() => dismissKeyboard()}
              highlightColor={'#009FE3'}
              onChangeText={(text) => this.setState({year : text, improperYear: false})}
              value={this.state.year}
            />
          </View>
        )
    }
  }

  renderError(){
    if (this.state.emptySymptom){
      return (
      <Footer style={styles.footer}>
          <Animatable.Text ref='footer' style={styles.footerTitle}>{I18n.t('emptySymptom')}</Animatable.Text>
      </Footer>
      )
      setTimeout(() => {this.setState({emptySymptom: false})}, 10000)
    }
    if (this.state.improperYear){
      return (
      <Footer style={styles.footer}>
          <Animatable.Text ref='footer' style={styles.footerTitle}>{I18n.t('improperYear')}</Animatable.Text>
      </Footer>
      )
      setTimeout(() => {this.setState({improperYear: false})}, 10000)
    }
    if (!this.state.isConnected){
      return (
      <Footer style={styles.footer}>
          <Animatable.Text ref='footer' style={styles.footerTitle}>I18n.t('checkConnection')</Animatable.Text>
      </Footer>
      )
      setTimeout(() => {this.setState({emptySymptom: true})}, 10000)
    }
  }

  logout(){
    AsyncStorage.multiSet([['logged','false'],['token','']])
    var url = API_LOGOUT + this.props.token
      fetch(url).then(res => res.json()).then(json => console.log(json))
      Actions.login()
  }
}

 const styles = StyleSheet.create({
   footer: {
    backgroundColor: '#F8F8F8',
    color: '#6b6b6b',
   },
   itemText: {
     fontSize: 15,
     margin: 2
   },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#009fe3',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0
  },
  button: {
    position: 'absolute',
    top: 100
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
 });

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}

export default Search
