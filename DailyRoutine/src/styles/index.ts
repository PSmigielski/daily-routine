import * as Colors from './colors';
import * as Typography from './typography';
import * as Mixins from './mixins';
import {Dimensions, StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
  spacer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonsWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  startPageWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  startPageText: {
    fontFamily: Typography.FONT_FAMILY_DEFAULT,
    fontSize: Typography.FONT_SIZE_24,
    width: '80%',
    marginBottom: 20,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  contentWrapper: {
    flex: 9,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    width: Dimensions.get('window').width,
  },
  logoText1: {
    color: Colors.PRIMARY_TEXT,
    fontSize: Typography.FONT_SIZE_32,
    fontFamily: Typography.FONT_FAMILY_DECORATIVE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText2: {
    color: Colors.CTA,
    fontSize: Typography.FONT_SIZE_32,
    fontFamily: Typography.FONT_FAMILY_DECORATIVE,
  },
  logoTextBackground: {
    backgroundColor: Colors.SECONDARY,
    ...Mixins.padding(0, 4, 2, 4),
  },
  shadowStrech: {
    alignSelf: 'stretch',
  },
  styledButtonShadow: {
    width: '80%',
  },
  styledButton: {
    backgroundColor: Colors.SECONDARY,
    height: 60,
    width: '100%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styledButtonText: {
    color: Colors.CTA,
    fontFamily: Typography.FONT_FAMILY_DECORATIVE,
    fontSize: Typography.FONT_SIZE_32,
    padding: 0,
    margin: 0,
  },
  appWrapper: {
    backgroundColor: Colors.BACKGROUND,
    textAlign: 'center',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
});
export {Typography, Colors, Mixins};
