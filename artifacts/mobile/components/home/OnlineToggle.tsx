import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

export function OnlineToggle() {
  const colors = useColors();
  const { isOnline, setIsOnline } = useAuthStore();
  const translateX = useSharedValue(isOnline ? 28 : 0);
  const bgColor = useSharedValue(isOnline ? 1 : 0);

  const toggle = () => {
    const next = !isOnline;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsOnline(next);
    translateX.value = withSpring(next ? 28 : 0, { damping: 14, stiffness: 300 });
    bgColor.value = withTiming(next ? 1 : 0, { duration: 200 });
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Pressable onPress={toggle} style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.muted }]} />
        <View>
          <Text style={[styles.statusLabel, { color: colors.mutedForeground }]}>Status</Text>
          <Text style={[styles.statusValue, { color: isOnline ? colors.success : colors.foreground }]}>
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.track,
          { backgroundColor: isOnline ? colors.success : colors.muted },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            { backgroundColor: "#FFFFFF", shadowColor: "#000" },
            thumbStyle,
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  statusValue: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  track: {
    width: 56,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    padding: 2,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
