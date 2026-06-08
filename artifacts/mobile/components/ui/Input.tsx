import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  containerStyle?: ViewStyle;
  hint?: string;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  icon,
  iconRight,
  containerStyle,
  hint,
  isPassword,
  style,
  ...props
}: InputProps) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: error
              ? colors.destructive
              : focused
              ? colors.primary
              : colors.border,
            borderRadius: colors.radiusSm,
          },
        ]}
      >
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <TextInput
          {...props}
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              color: colors.foreground,
              paddingLeft: icon ? 0 : 16,
              paddingRight: isPassword || iconRight ? 0 : 16,
            },
            style,
          ]}
          placeholderTextColor={colors.mutedForeground}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconRight}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        )}
        {!isPassword && iconRight && (
          <View style={styles.iconRight}>{iconRight}</View>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
      )}
      {hint && !error && (
        <Text style={[styles.hint, { color: colors.mutedForeground }]}>{hint}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    overflow: "hidden",
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    paddingVertical: 14,
    letterSpacing: -0.1,
  },
  iconLeft: {
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconRight: {
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 6,
  },
  hint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 6,
  },
});
