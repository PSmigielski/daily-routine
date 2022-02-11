import React from 'react';
import {StatusBar, View} from 'react-native';
import {styles} from '../../../styles';
import Logo from '../../atoms/Logo';
import Content from '../../molecules/Content';

const AppWrapper = ({children}: {children: JSX.Element[] | JSX.Element}) => {
  return (
    <View style={styles.appWrapper}>
      <StatusBar backgroundColor={'#17161D'} />
      <Logo />
      <Content>{children}</Content>
    </View>
  );
};

export default AppWrapper;
