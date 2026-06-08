import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

type BadgeVariant = "default" | "success" | "warning" | "destructive" | "accent" | "outline" | "primary";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  style?: ViewStyle;
  dot?: boolean;
}

export function Badge({ label, variant = "default", size = "sm", style, dot }: BadgeProps) {
  const colors = useColors();

  const getBg = () => {
    switch (variant) {
      case "success": return colors.successLight;
      case "warning": return colors.warningLight;
      case "destructive": return colors.destructiveLight;
      case "accent": return colors.accentLight;
      case "primary": return colors.primaryLight;
      case "outline": return "transparent";
      default: return colors.muted;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "success": return colors.success;
      case "warning": return colors.warning;
      case "destructive": return colors.destructive;
      case "accent": return colors.accent;
      case "primary": return colors.primary;
      case "outline": return colors.foreground;
      default: return colors.mutedForeground;
    }
  };

  const getDotColor = () => getTextColor();

  const fontSize = size === "sm" ? 11 : 13;
  const px = size === "sm" ? 8 : 12;
  const py = size === "sm" ? 4 : 6;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBg(),
          paddingHorizontal: px,
          paddingVertical: py,
          borderColor: variant === "outline" ? colors.border : "transparent",
          borderWidth: variant === "outline" ? 1 : 0,
        },
        style,
      ]}
    >
      {dot && (
        <View style={[styles.dot, { backgroundColor: getDotColor() }]} />
      )}
      <Text style={[styles.text, { color: getTextColor(), fontSize }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    gap: 5,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
