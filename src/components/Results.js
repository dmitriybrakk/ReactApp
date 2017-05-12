import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  View,
  NetInfo
} from 'react-native';
import * as Animatable from 'react-native-animatable'
import {Actions} from 'react-native-router-flux'
import { Container, Content, Card, CardItem, Thumbnail, Text, Header, Title, Button, Icon, Footer} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay'
// const API='https://staging.symptoma.com/api/v3/info/';
const API_INFO ='https://www.symptoma.com/api/v3/info/';

class Results extends Component {

constructor(props){
  super(props)
  this.state = {
    offset: 0,
    hideNavBar: false,
    loading: false,
    isConnected: true,
    trigger: false
  },
  this.fetchDetails.bind(this)
}

onScroll(event){
    var currentOffset = event.nativeEvent.contentOffset.y
    var direction = currentOffset > this.state.offset ? 'down' : 'up'
    this.setState({offset : currentOffset})
    if (direction === 'down'){
        this.setState({hideNavBar: true})
    } else {
      this.setState({hideNavBar: false})
    }
    this.setState({trigger: false})
}

componentDidMount(){
  this.forceUpdate(this.setState({loading: false}))
  const dispatchConnected = isConnected => this.setState({isConnected: isConnected});

    NetInfo.isConnected.fetch().then().done(() => {
    NetInfo.isConnected.addEventListener('change', dispatchConnected);
  });
}

async fetchDetails(item, token){
  this.setState({loading: true})
  if(this.state.isConnected){
    var url = API_INFO + item.value + "?apikey=rk4sozneoenthrynz28qeaw0feiak0jm&token=" + token + "&lang=" + this.props.locale;
    // fetch(url).then(res => res.json()).then(json =>)
    const res = await fetch(url)
    console.log(res)
    const json = await res.json()
    await this.setState({loading: false})
    Actions.details({details: json.results, heading: item.label, slug: item.value, token: token, url: url, lang: this.props.locale})
  } else {
      await this.setState({trigger: true, loading: false})
  }
}

renderRow(item){
  const bars = [require('../assets/bar0.png'),
                   require('../assets/bar1.png'),
                    require('../assets/bar2.png'),
                     require('../assets/bar3.png')]
  const unknown = require('../assets/barunknown.png')
  var bar = item.weight === -1 ? unknown : bars[item.weight]
  return (
    <CardItem button onPress={() => this.fetchDetails(item, this.props.token)}
        style={{flex : 1}}>
      <Thumbnail source={bar}/>
      <Text>{item.label}</Text>
      <Text note style={{textDecorationLine: 'line-through'}}>{item.excluded}</Text>
    </CardItem>
  )
}

scrollToTop(){
    this.content.scrollTo(0,0,true)
}
//  onScroll={this.onScroll.bind(this)}
render(){
  var navBarStyle = this.state.hideNavBar ? {height: 0} : {}
    return (
        <Container>
          <Header ref='header' backgroundColor="#333A44" alignItems='center' style={navBarStyle}>
          <Button transparent onPress={() => Actions.pop()}>
              <Icon name='ios-arrow-back' style={{color: '#ffffff'}}/>
          </Button>
              <Title>symptoma</Title>
          </Header>
          <View style={{height: 30, backgroundColor: '#ccc',alignItems: 'center'}}>
              <Text numberOfLines={3} allowFontScaling={true}  style={{color:'white'}}>
                {this.props.locale == 'de' ? 'Ergebnisse für:' : 'Results for:'} {this.props.input.join(',')}
              </Text>
          </View>

          <View style={{ flex: 0.01 }}>
            <Spinner visible={this.state.loading}/>
          </View>

          <Content ref={(scrollView) => {this.content = scrollView}}>

            <Card  dataArray={this.props.results}
              renderRow={(item) =>
                          this.renderRow(item)
                        }>
            </Card>
          </Content>
          <View style={{height: this.state.hideNavBar ? 20 : 0, backgroundColor: '#333A44', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => this.scrollToTop.bind(this)}>
              <Animatable.Text style={{color: 'white'}}>Return to top</Animatable.Text>
            </TouchableOpacity>
          </View>
          {this.renderError()}
        </Container>
      )
  }

  renderError(){
    if(!this.state.isConnected && this.state.trigger){
      return (
      <Footer style={styles.footer}>
          <Animatable.Text ref='footer' style={styles.footerTitle}>{this.props.locale == 'de' ? 'Bitte prüfen Ihnen Internetverbindung' : 'Please check your interner connection'}</Animatable.Text>
      </Footer>
      )
      setTimeout(() => {this.setState({trigger: false})}, 10000)
    }
  }
}

export default Results
