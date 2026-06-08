import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  body: string;
  confirmText: string;
  onConfirm: () => void;
  cancelText?: string;
  onCancel?: () => void;
  variant?: "destructive" | "warning" | "success" | "info";
  icon?: string;
}

export function ConfirmModal({
  visible,
  onClose,
  title,
  body,
  confirmText,
  onConfirm,
  cancelText = "Cancel",
  onCancel,
  variant = "destructive",
  icon,
}: ConfirmModalProps) {
  const colors = useColors();

  const variantColor = {
    destructive: colors.destructive,
    warning: colors.warning,
    success: colors.success,
    info: colors.info,
  }[variant];

  const variantLight = {
    destructive: colors.destructiveLight,
    warning: colors.warningLight,
    success: colors.successLight,
    info: colors.infoLight,
  }[variant];

  const defaultIcon = {
    destructive: "alert-circle",
    warning: "alert-triangle",
    success: "check-circle",
    info: "info",
  }[variant];

  const iconName = icon ?? defaultIcon;

  const handleCancel = () => {
    if (onCancel) onCancel();
    else onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View
        entering={FadeIn.duration(180)}
        style={styles.scrim}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          entering={SlideInDown.springify().damping(20).stiffness(200)}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: variantLight }]}>
            <Feather name={iconName as any} size={28} color={variantColor} />
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>
            {title}
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            {body}
          </Text>

          <View style={styles.actions}>
            {cancelText ? (
              <Pressable
                onPress={handleCancel}
                style={({ pressed }) => [
                  styles.cancelBtn,
                  {
                    borderColor: colors.border,
                    backgroundColor: pressed ? colors.muted : "transparent",
                    borderRadius: colors.radiusXs,
                  },
                ]}
              >
                <Text style={[styles.cancelText, { color: colors.foreground }]}>
                  {cancelText}
                </Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => [
                styles.confirmBtn,
                {
                  backgroundColor: pressed
                    ? variantColor + "CC"
                    : variantColor,
                  flex: cancelText ? 1.4 : 1,
                  borderRadius: colors.radiusXs,
                },
              ]}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  confirmBtn: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#FFF",
  },
});
