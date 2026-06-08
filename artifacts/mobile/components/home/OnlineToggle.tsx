import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";

export function OnlineToggle() {
  const colors = useColors();
  const { isOnline, setIsOnline } = useAuthStore();
  const { startShift, endShift } = useAppStore();

  const translateX = useSharedValue(isOnline ? 1 : 0);
  const bgProgress = useSharedValue(isOnline ? 1 : 0);

  const toggle = () => {
    const next = !isOnline;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsOnline(next);
    if (next) {
      startShift();
    } else {
      endShift();
    }
    translateX.value = withSpring(next ? 1 : 0, { damping: 18, stiffness: 350 });
    bgProgress.value = withTiming(next ? 1 : 0, { duration: 300 });
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(translateX.value * 36, { damping: 18, stiffness: 350 }),
      },
    ],
  }));

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgProgress.value,
      [0, 1],
      [colors.muted, colors.success]
    ),
  }));

  return (
    <Pressable onPress={toggle} style={styles.container}>
      <View style={styles.labelSection}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.mutedForeground }]} />
          <Text style={[styles.statusText, { color: colors.foreground }]}>
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
        <Text style={[styles.statusSub, { color: colors.mutedForeground }]}>
          {isOnline ? "Accepting new orders" : "Not receiving orders"}
        </Text>
      </View>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]}>
          <View style={[styles.thumbInner, { backgroundColor: isOnline ? colors.success : colors.mutedForeground }]} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelSection: { gap: 3 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  statusSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  track: {
    width: 72,
    height: 36,
    borderRadius: 18,
    padding: 3,
    justifyContent: "center",
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbInner: { width: 10, height: 10, borderRadius: 5 },
});
