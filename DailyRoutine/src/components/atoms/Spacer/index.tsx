import React from 'react';
import {View} from 'react-native';
import {styles} from '../../../styles';

type Space = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
type Props = {
  child: JSX.Element;
  margin?: Space;
  padding?: Space;
};
const Spacer = ({
  child,
  margin = {top: 0, right: 0, bottom: 0, left: 0},
}: Props) => {
  const style = {
    marginTop: margin.top,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
    marginRight: margin.right,
  };
  return <View style={[style, styles.spacer]}>{child}</View>;
};

export default Spacer;
