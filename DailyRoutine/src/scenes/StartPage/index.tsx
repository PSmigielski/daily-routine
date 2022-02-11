import React from 'react';
import {View, Text} from 'react-native';
import StyledButton from '../../components/atoms/StyledButton';
import Buttons from '../../components/molecules/Buttons';
import {styles} from '../../styles';

const StartPage = () => {
  return (
    <View style={styles.startPageWrapper}>
      <Text style={styles.startPageText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa vitae, in
        felis aliquet blandit. Egestas suspendisse non cursus morbi accumsan
        tellus vehicula.
      </Text>
      <Buttons marginBottom={30}>
        <StyledButton title="Sign in" />
        <StyledButton title="Sign up" />
      </Buttons>
    </View>
  );
};

export default StartPage;
