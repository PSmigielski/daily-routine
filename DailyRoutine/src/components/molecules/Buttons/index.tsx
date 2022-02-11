import React from 'react';
import {View} from 'react-native';
import {styles} from '../../../styles';
import Spacer from '../../atoms/Spacer';

const Buttons = ({
  children,
  marginBottom,
}: {
  children: JSX.Element[];
  marginBottom: number;
}) => {
  return (
    <View style={styles.buttonsWrapper}>
      {children.map((child: JSX.Element, index) => (
        <Spacer
          child={child}
          key={index}
          margin={{top: 0, left: 0, right: 0, bottom: marginBottom}}
        />
      ))}
    </View>
  );
};

export default Buttons;
