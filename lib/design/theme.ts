import { colors } from "./colors";
import { radius } from "./radius";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const theme = {
  colors,
  typography,
  spacing,
  radius,
} as const;

export type Theme = typeof theme;

export {
  colors,
  radius,
  spacing,
  typography,
};