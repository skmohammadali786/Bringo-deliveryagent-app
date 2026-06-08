import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );

    const timer = setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <LinearGradient
      colors={["#FF6B35", "#E55A26", "#C94D1A"]}
      style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 40 : 0) }]}
    >
      <Animated.View entering={FadeIn.duration(600)} style={[styles.center]}>
        <Animated.View style={[styles.iconWrap, logoStyle]}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Text style={styles.brand}>Bringo Agent</Text>
          <Text style={styles.tagline}>Deliver with confidence</Text>
        </Animated.View>
      </Animated.View>
      <Animated.View
        entering={FadeIn.delay(800).duration(600)}
        style={[styles.bottom, { paddingBottom: insets.bottom + 32 }]}
      >
        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.dot, { opacity: i === 1 ? 1 : 0.4 }]}
            />
          ))}
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: { width: 80, height: 80 },
  brand: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 6,
  },
  bottom: { alignItems: "center" },
  dots: { flexDirection: "row", gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
});
