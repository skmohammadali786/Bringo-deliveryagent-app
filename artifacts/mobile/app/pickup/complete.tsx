import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { fadeInDownDelay } from "@/constants/animations";

export default function PickupCompleteScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(0);

  useEffect(() => { scale.value = withSpring(1, { damping: 10, stiffness: 150 }); }, []);
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === "web" ? 100 : 100) }]}>
        <Animated.View style={[styles.iconWrap, { backgroundColor: colors.success }, iconStyle]}>
          <Feather name="check" size={56} color="#FFF" />
        </Animated.View>
        <Animated.View entering={fadeInDownDelay(300)} style={{ gap: 10, alignItems: "center" }}>
          <Text style={[styles.title, { color: colors.foreground }]}>Pickup Complete!</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Order picked up successfully. Now head to the customer's location.
          </Text>
        </Animated.View>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}>
        <Button title="Start Delivery Navigation" onPress={() => router.push("/delivery/navigate" as any)} size="xl" variant="success" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, alignItems: "center", gap: 24 },
  iconWrap: { width: 120, height: 120, borderRadius: 60, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 30, fontFamily: "Inter_700Bold", letterSpacing: -0.8, textAlign: "center" },
  sub: { fontSize: 16, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 26 },
  footer: { paddingHorizontal: 24 },
});
