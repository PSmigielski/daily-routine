import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import Logo from './components/atoms/Logo';
import StyledButton from './components/atoms/StyledButton';
import Buttons from './components/molecules/Buttons';
import Content from './components/organisms/Content';
import {styles} from './styles';
const App = () => {
  return (
    <View style={styles.appView}>
      <StatusBar backgroundColor={'#17161D'} />
      <Logo />
      <Content>
        <Text style={styles.startPageText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa vitae,
          in felis aliquet blandit. Egestas suspendisse non cursus morbi
          accumsan tellus vehicula.
        </Text>
        <Buttons marginBottom={30}>
          <StyledButton title="Sign in" />
          <StyledButton title="Sign up" />
        </Buttons>
      </Content>
    </View>
  );
};

export default App;
