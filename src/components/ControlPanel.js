import React, {Component} from 'react'
import {
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {Picker, Button, Icon} from 'native-base'
import I18n from '../i18n/Localization.js'

const Item = Picker.Item

export default class ControlPanel extends Component {

  constructor(props){
    super(props)
  }

  render() {
    let {logout} = this.props
    let {email} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.controlText}>{this.props.email}</Text>
        <View style={styles.sidebar}>
          <Text style={styles.controlText}>{I18n.t('chooseLanguage')}</Text>
          <Picker style={styles.picker}
              iosHeader={I18n.t('chooseLanguage')}
              selectedValue={this.props.locale}
              onValueChange={(value) => this.props.changeLocale(value)}>
              <Item label={I18n.t('english_en')} value="en" />
              <Item label={I18n.t('german_de')} value="de" />
          </Picker>
        </View>
        <View style={styles.sidebar}>
          <Text style={styles.controlText}>{I18n.t('chooseRegion')}</Text>
          <Picker style={styles.picker}
              iosHeader={I18n.t('chooseRegion')}
              selectedValue={this.props.region}
              onValueChange={(value) => this.props.changeRegion(value)}>
                <Item label={I18n.t('germany')} value="de" />
                <Item label={I18n.t('austria')} value="at" />
                <Item label={I18n.t('usa')} value="us" />
          </Picker>
        </View>
        <View style={styles.sidebar}>
          <Button primary onPress={() => this.props.logout()}>
             <Icon name='ios-exit' /> 
              {I18n.t('logout')}
          </Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  controlText: {
    color: 'black',
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  picker: {
  },
  sidebar: {
    height: 50,
    padding: 10
  }
})
