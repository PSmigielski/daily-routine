import {scaleFont} from './mixins';

export const FONT_FAMILY_DEFAULT = 'Manrope';
export const FONT_FAMILY_DECORATIVE = 'PoetsenOne';

export const FONT_WEIGHT_REGULAR = '400';
export const FONT_WEIGHT_BOLD = '700';

export const FONT_SIZE_32 = scaleFont(32);
export const FONT_SIZE_24 = scaleFont(24);
export const FONT_SIZE_16 = scaleFont(16);

export const FONT_REGULAR = {
  fontFamily: FONT_FAMILY_DEFAULT,
  fontWeight: FONT_WEIGHT_REGULAR,
};

export const FONT_BOLD = {
  fontFamily: FONT_FAMILY_DEFAULT,
  fontWeight: FONT_WEIGHT_BOLD,
};
