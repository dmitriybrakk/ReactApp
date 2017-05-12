import React, { Component } from 'react';
import { Text, StyleSheet, View, WebView, ScrollView, TouchableHighlight } from 'react-native'
import {Actions} from 'react-native-router-flux'
import { Container, Header, Title, Content, Button, Icon, List, ListItem} from 'native-base'
import * as Animatable from 'react-native-animatable'
var HTMLView = require('react-native-htmlview')
// import Collapsible from 'react-native-collapsible'
// import Accordion from 'react-native-collapsible/Accordion'
import Collapsible from './Collapsible'
import Accordion from './Accordion'
import Spinner from 'react-native-loading-spinner-overlay'
import ActionButton from 'react-native-action-button';

var GRAPH = 'https://www.symptoma.com/api/v3/graph/'
const API_INFO ='https://www.symptoma.com/api/v3/info/'

var region = 'de'
var gender = ''
var birthyear = ''

class Details extends Component {

constructor(props){
	super(props)
	this.state = {
		activeSection: false,
		collapsed: false,
		loading: false,
		isConnected: true,
		trigger: false
	}
}

componentDidMount(){
  this.forceUpdate(this.setState({loading: false}))
  const dispatchConnected = isConnected => this.setState({isConnected: isConnected});

    NetInfo.isConnected.fetch().then().done(() => {
    NetInfo.isConnected.addEventListener('change', dispatchConnected);
  });
}

_toggleExpanded = () => {
	 this.setState({ collapsed: !this.state.collapsed });
 }

	render(){
		return(
			<Container>
				<Header backgroundColor="#333A44" alignItems='center'>
					<Button transparent onPress={() => Actions.pop()}>
								<Icon name='ios-arrow-back' style={{color: '#ffffff'}}/>
					</Button>
					<Title>symptoma</Title>
				</Header>
      	<Content>
				<View style={{flex :1}}>
					<View style={{alignItems: 'center', flex: 0.1}}>
							<Text style={{fontWeight: 'bold', fontSize: 20}}>
								{this.props.heading}
							</Text>
					</View>
					<View style={{width: 420, height: 1, backgroundColor: '#ccc'}}></View>
					<View style={{width: 350, marginLeft: 5}}>
							<HTMLView value={this.props.details[0].text} stylesheet={styles}
								onLinkPress={(url) => this.getDetailsFromLink(url)}/>
					</View>
					<View style={{flex: 1, flexDirection: 'row',marginLeft: 5}}>
							<View style={{flex: 0.5}}>
									<Text style={{fontWeight: 'bold'}}>Sex Distribution</Text>
							</View>
							<View style={{flex: 0.5}}>
									<Text style={{fontWeight: 'bold'}}>Age Distribution</Text>
							</View>
					</View>
					<View style={{flex: 1, flexDirection: 'row',marginRight: 35}}>
							<View style={{flex: 0.5}}>
								<WebView
									style={{width: 150, height: 300,}}
									scrollEnabled={false}
									bounces={false}
									source={{uri: GRAPH+'gender/'+this.props.slug+'?region='+region+'&gender='+gender +'&format=html&apikey=rk4sozneoenthrynz28qeaw0feiak0jm&token='+this.props.token}}/>
							</View>
							<View style={{flex: 0.5}}>
								<WebView
									style={{width: 170, height: 300}}
									scrollEnabled={false}
									bounces={false}
									source={{uri: GRAPH+'incidence/'+this.props.slug+'?region='+region+'&birthyear='+birthyear
									+'&format=html&apikey=rk4sozneoenthrynz28qeaw0feiak0jm&token='
									+this.props.token}}	/>
							</View>
					</View>
					<View style={{ flex: 1 }}>
						<Spinner visible={this.state.loading}/>
					</View>
					<View style={{top: -130}}>
						{this.renderSections(this.props.details.slice(1,this.props.details.length))}
					</View>
					<Button block style={{flex : 1, backgroundColor: '#333a44'}} onPress={() => Actions.pop()}>
						<Text style={{color:'#fff'}}>Back</Text>
					</Button>
				</View>
        </Content>
				{this.renderError()}
      </Container>
		)
	}

	renderSections(sections){
				return(
					sections.map(function(section, i){
						if (section.chapter === 'References'){
								return (
									<View key={i}>
										<TouchableHighlight onPress={this.toggleExpanded}>
											<View style={styles.header}>
												<Text style={styles.headerText}>{section.chapter}</Text>
											</View>
										</TouchableHighlight>
										<Collapsible collapsed={this.state.collapsed} align="center">
											<List dataArray={section.text}
														renderRow={(item) =>
															<ListItem>
																<HTMLView value={item} stylesheet={styles} onLinkPress={(url) => this.getDetailsFromLink(url)}/>
															</ListItem>
														}>
													</List>
										</Collapsible>
									</View>
								)
						} else {
							if ('symptoms' in section){console.log("Found symptoms in " + section)}
							return (
								<View key={i}>
								<TouchableHighlight onPress={this._toggleExpanded}>
									<View style={styles.header}>
										<Text style={styles.headerText}>{section.chapter}</Text>
									</View>
								</TouchableHighlight>
								<Collapsible collapsed={this.state.collapsed} align="center">
									<View style={styles.content}>
										<HTMLView value={section.text} stylesheet={styles}
											onLinkPress={(url) => this.getDetailsFromLink(url).done()}/>
									</View>
								</Collapsible>
								</View>
							)
						}
					}.bind(this))
				)
	}

	async getDetailsFromLink(url){
		if(this.state.isConnected){
			this.setState({loading: true})
			var cut = url.substring(url.lastIndexOf('/') + 1,url.length)
			var URL = API_INFO + cut + "?apikey=rk4sozneoenthrynz28qeaw0feiak0jm&token=" + this.props.token + "&lang=" + this.props.lang;
			var slug = cut.toLowerCase()
			if (slug.indexOf(' ')>=0){
				slug.split(' ').join('-')
			}
			const response = await fetch(URL)
			const json = await response.json()
			// fetch(URL).then(res => res.json()).then(json =>)
			await this.setState({loading : false})
			Actions.details({details: json.results, heading: cut.charAt(0).toUpperCase() + cut.slice(1), slug: slug, token: this.props.token, lang: this.props.lang})
		} else {
			await this.setState({trigger: true, loading: false})
		}
	}

	renderError(){
		if(!this.state.isConnected && this.state.trigger){
			return (
			<Footer style={styles.footer}>
					<Animatable.Text ref='footer' style={styles.footerTitle}>{this.props.lang == 'de' ? 'Bitte prufen Ihnen Internetverbindung' : 'Please check your Internet connection'}</Animatable.Text>
			</Footer>
			)
			setTimeout(() => {this.setState({trigger: false})}, 10000)
		}
	}
}

const styles = StyleSheet.create({
	a: {
		color: '#009fe3'
	},
	actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
		backgroundColor: '#9EA2A8',
    // backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
		color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
});

export default Details

//parse html with regex
// // .replace(/<[^>]*>/g, '')

// _setSection(section) {
// 	this.setState({ activeSection: section });
// }
//
// _renderHeader(section, i, isActive) {
// 	return (
// 		<Animatable.View duration={400} style={[styles.header, isActive ? styles.active : styles.inactive]} transition="backgroundColor">
// 			<Text style={styles.headerText}>{section.chapter}</Text>
// 		</Animatable.View>
// 	);
// }
//
// _renderContent(section, i, isActive) {
// 	if (section.chapter === 'References'){
// 		return (
// 			<Animatable.View duration={400}  style={[styles.content, isActive ? styles.active : styles.inactive]} transition="backgroundColor">
// 						<List dataArray={section.text}
// 											renderRow={(item) =>
// 													<ListItem>
// 															<HTMLView value={item} stylesheet={styles} onLinkPress={(url) => this.getDetailsFromLink(url)}/>
// 													</ListItem>
// 											}>
// 									</List>
// 				</Animatable.View>
// 		)
// 	}
// 	if (section.hasOwnProperty('symptoms')){console.log(section)}
// 	return (
// 		<Animatable.View duration={400}  style={[styles.content, isActive ? styles.active : styles.inactive]} transition="backgroundColor">
// 			<Animatable.Text animation={isActive ? 'bounceIn' : undefined}>
// 				<HTMLView value={section.text} stylesheet={styles} onLinkPress={(url) => this.getDetailsFromLink(url)}/>
// 			</Animatable.Text>
// 		</Animatable.View>
// 	)
// }
// <Accordion
// 	 activeSection={this.state.activeSection}
// 	 sections={this.props.details.slice(1,this.props.details.length)}
// 	 renderHeader={this._renderHeader}
// 	 renderContent={this._renderContent.bind(this)}
// 	 duration={400}
// 	 onChange={this._setSection.bind(this)}
//  />
