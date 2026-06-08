import colors from "@/constants/colors";
import { useThemeStore } from "@/store/themeStore";

export function useColors() {
  const { theme } = useThemeStore();
  const palette = theme === "dark" && "dark" in colors
    ? (colors as Record<string, typeof colors.light>).dark
    : colors.light;
  return {
    ...palette,
    radius: colors.radius,
    radiusSm: colors.radiusSm,
    radiusXs: colors.radiusXs,
    radiusLg: colors.radiusLg,
  };
}
