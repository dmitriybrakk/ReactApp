import React, { Component, PropTypes } from 'react';
import {
  ListView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native';
import Tag from './Tag'

const API_SUGGESTIONS = 'https://www.symptoma.com/api/v3/symptoms/suggestions?apikey=rk4sozneoenthrynz28qeaw0feiak0jm&token='

class Autocomplete extends Component {
  static propTypes = {
    ...TextInput.propTypes,
    token: React.PropTypes.string,
    renderSeparator: PropTypes.func,
    placeholder: React.PropTypes.string,
    lang: React.PropTypes.string,
  };

  static defaultProps = {
    token: '',
    renderSeparator: null,
    placeholder: ''
  };

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource: ds.cloneWithRows([]),
      symptoms: [],
      query: '',
      tags: [],
      listPosition: {
        top: 0,
        left: 0,
        right: 0,
      },
      showList: false,
    };
  }

  blur() {
    const { textInput } = this
    textInput && textInput.blur()
    this.setState({showList: false})
  }

  focus() {
    const { dataSource } = this.state
    const { textInput } = this
    textInput && textInput.focus()
  }

  clearText() {
    const { textInput } = this;
    this.setState({query: ''});
    textInput && textInput.setNativeProps({text: ''});
  }

  addTag(tag){
      var newTags = this.state.tags.concat([tag])
      this.setState({tags: newTags})
      this.clearText()
      this.props.onChange(newTags)
  }

  removeTag(tag){
      var newTags = this.state.tags.filter((t) => (t !== tag));
      this.setState({tags: newTags})
      this.props.onChange(newTags)
  }

  renderRow(rowData, sectionID, rowID){
      return (
        <TouchableOpacity onPress={this.addTag.bind(this,rowData.label)}>
          <View style={styles.rowContainer}>
            <Text style={styles.text}>{rowData.label}</Text>
          </View>
        </TouchableOpacity>
      )
  }

  renderResultList() {
    const { dataSource, listPosition, query, showList } = this.state;
    const { renderSeparator } = this.props;
    const symptoms = query.length > 1 ? this.getSuggestions(query) : [];

    const comp = (s, s2) => s.toLowerCase().trim() === s2.toLowerCase().trim();

    return (
      <ListView
        key={this.data}
        enableEmptySections={true}
        dataSource={symptoms.length === 1 && comp(query, symptoms[0].label) ? dataSource.cloneWithRows([]) : dataSource.cloneWithRows(symptoms)}
        keyboardShouldPersistTaps="always"
        renderRow={this.renderRow.bind(this)}
        renderSeparator={renderSeparator}
        style={[styles.list, listPosition]}
      />
    );
  }

  getSuggestions(query) {
      fetch(API_SUGGESTIONS+this.props.token+"&query="+query+"&lang="+this.props.lang)
        .then(res => res.json())
        .then(json => { this.setState({symptoms: json.results }) })

        return this.state.symptoms;
  }

  onTextChange(text){
    this.setState({query: text})
    const { query, dataSource } = this.state
    this.setState({showList: true})
  }

  onChangeLayout(e) {
    let layout = e.nativeEvent.layout;

    this.setState({
      listPosition: {
        top: layout.height,
        left: 0,
        right: 0,
      }
    })
  }

  render() {
    return (
      <View style={[styles.container]}>
        <View ref='tagInput' style={[styles.inputContainer]}>
          {this.state.tags.map((tag) => (
            <Tag key={tag} text={tag} onPress={this.removeTag.bind(this, tag)} onLayout={this.onChangeLayout.bind(this)}/>
          ))}
          <TextInput
            style={styles.input}
            ref={ref => (this.textInput = ref)}
            autoCorrect={false}
            autoCapitalize='none'
            placeholder={ this.state.tags.length == 0 ? this.props.placeholder : ''}
            onFocus={this.focus.bind(this)}
            onBlur={this.blur.bind(this)}
            onChangeText={(text) => this.onTextChange(text)}
            onSubmitEditing={(event) => this.handleKeyPress(event)}
          />
        </View>
        <View>
          {this.renderResultList()}
        </View>
      </View>
    );
  }

  handleKeyPress(e){
    const { query, symptoms } = this.state
    if(query.length > 1){
      if(symptoms.length != 0){
        this.addTag(symptoms[0].label)
      } else {
        this.addTag(query)
      }
    }
  }
}

const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderWidth: 1
};

const androidStyles = {
  container: {
    flex: 1
  },
  inputContainer: {
    ...border,
    marginBottom: 0,
    flexDirection:'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    ...border,
    backgroundColor: 'white',
    borderTopWidth: 0,
    margin: 10,
    marginTop: 0
  }
};

const iosStyles = {
  container: {
    zIndex: 1
  },
  inputContainer: {
    ...border,
    flexDirection:'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    ...border,
    backgroundColor: 'white',
    borderTopWidth: 0,
    left: 0,
    position: 'absolute',
    right: 0
  }
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    alignSelf: 'stretch',
    minWidth: 50,
    margin:2,
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3
  },
  rowContainer: {
    backgroundColor: 'white',
    justifyContent:'center',
    padding:10,
  },
  text: {
    fontSize: 10,
  },
  ...Platform.select({
    android: { ...androidStyles },
    ios: { ...iosStyles }
  })
});

export default Autocomplete;
