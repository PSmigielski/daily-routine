import React from 'react';
import {View} from 'react-native';
import {styles} from '../../../styles';

const Content = ({children}: {children: JSX.Element[]}) => {
  return <View style={styles.contentWrapper}>{children}</View>;
};

export default Content;
