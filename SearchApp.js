import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

class App extends Component {
  state = {
    search: '',
  };

  filterList(list) {
    return list.filter(listItem => listItem.toLowerCase().includes(this.state.search.toLowerCase()));
  }

  render() {
    const list = ['The Weeknd', 'Drake', 'Roddy Ricch', 'Dua Lipa'];

    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={(search) => this.setState({search})}
          style={styles.searchBar}
        />
        {this.filterList(list).map((listItem, index) => (
          <Text key={index} style={styles.itemText}>{listItem}</Text>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    height: '100%',
  },
  searchBar: {
    fontSize: 24,
    margin: 10,
    width: '90%',
    height: 50,
    backgroundColor: 'white',
  },
  itemText: {
    margin: 10,
    color: 'white',
    fontSize: 24,
    backgroundColor: 'blue',
    width: '100%',
    height: 50
  }
});

export default App;