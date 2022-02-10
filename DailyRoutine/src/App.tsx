import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const App = () => {
  return (
    <View style={styles.mainView}>
      <Text style={styles.text}>Hello there</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 21,
    color: 'green',
  },
  mainView: {
    backgroundColor: 'white',
    textAlign: 'center',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default App;
