import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
} from 'react-native';
import {Button, Icon, Text } from 'native-base'

const Tag = ({
  text,
  tagContainer,
  onPress,
}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#efefef',
      paddingHorizontal: 5,
      margin: 2,
      borderRadius: 3,
      height:20,
    },
    text: {
      fontSize: 10,
      color: '#000'
    },
  })
  // <TouchableHighlight style={[styles.container, tagContainer]} onPress={onPress}>
  //   <Text style={styles.text}>{text}</Text>
  // </TouchableHighlight>
return (
  <Button iconLeft light onPress={onPress} style={[styles.container, tagContainer]} textStyle={{color: '#000'}}>
    <Icon name='ios-close' style={{color: '#000'}} />
    <Text style={{color: '#000'}}>{text}</Text>
  </Button>
  );
}

Tag.propTypes = {
  text: PropTypes.string,
  tagContainer: View.propTypes.style,
  onPress: PropTypes.func,
}

Tag.defaultProps = {
  text: 'none',
  tagContainer: null,
  onPress: () => {},
}

export default Tag;
