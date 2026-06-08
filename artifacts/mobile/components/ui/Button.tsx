import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  style?: object;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  icon,
  iconRight,
  fullWidth = true,
  style,
}: ButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled || loading) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const getBg = () => {
    if (disabled) return colors.muted;
    switch (variant) {
      case "primary": return colors.primary;
      case "secondary": return colors.secondary;
      case "outline": return "transparent";
      case "ghost": return "transparent";
      case "destructive": return colors.destructive;
      case "success": return colors.success;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.mutedForeground;
    switch (variant) {
      case "primary": return "#FFFFFF";
      case "secondary": return "#FFFFFF";
      case "outline": return colors.primary;
      case "ghost": return colors.foreground;
      case "destructive": return "#FFFFFF";
      case "success": return "#FFFFFF";
    }
  };

  const getPadding = () => {
    switch (size) {
      case "sm": return { paddingVertical: 10, paddingHorizontal: 16 };
      case "md": return { paddingVertical: 14, paddingHorizontal: 20 };
      case "lg": return { paddingVertical: 17, paddingHorizontal: 24 };
      case "xl": return { paddingVertical: 20, paddingHorizontal: 28 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "sm": return 13;
      case "md": return 15;
      case "lg": return 16;
      case "xl": return 17;
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
      style={[
        animStyle,
        styles.base,
        {
          backgroundColor: getBg(),
          borderColor: variant === "outline" ? colors.primary : "transparent",
          borderWidth: variant === "outline" ? 1.5 : 0,
          ...(fullWidth ? { alignSelf: "stretch" } : { alignSelf: "flex-start" }),
          borderRadius: colors.radius,
          ...getPadding(),
        },
        style,
      ]}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: getFontSize() },
            ]}
          >
            {title}
          </Text>
          {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
    textAlign: "center",
  },
  iconLeft: { marginRight: 2 },
  iconRight: { marginLeft: 2 },
});
