import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { fadeInDownDelay } from "@/constants/animations";

export default function ApprovalPendingScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false);
  }, []);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 80) }]}>
        <Animated.View entering={fadeInDownDelay(100)} style={styles.center}>
          <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
            <Animated.View style={spinStyle}>
              <Feather name="loader" size={48} color={colors.primary} />
            </Animated.View>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Waiting for Approval</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Order details sent to customer. Waiting for their confirmation before pickup.
          </Text>
        </Animated.View>
        <Animated.View entering={fadeInDownDelay(300)} style={styles.statusCard}>
          {[
            { label: "Order details sent", done: true },
            { label: "Customer reviewing", active: true },
            { label: "Approval received", pending: true },
            { label: "Proceed to pickup", pending: true },
          ].map((s, i) => (
            <View key={s.label} style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: s.done ? colors.success : s.active ? colors.primary : colors.muted }]}>
                <Feather name={s.done ? "check" : "circle"} size={12} color={s.done ? "#FFF" : s.active ? "#FFF" : colors.mutedForeground} />
              </View>
              <Text style={[styles.statusLabel, { color: s.done ? colors.success : s.active ? colors.primary : colors.mutedForeground }]}>
                {s.label}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}>
        <Button title="Customer Approved (Demo)" onPress={() => router.push("/pickup/instructions" as any)} />
        <Button title="Customer Rejected (Demo)" onPress={() => router.push("/product/alternative" as any)} variant="outline" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 32 },
  center: { alignItems: "center", gap: 16 },
  iconWrap: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8, textAlign: "center" },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  statusCard: { gap: 14 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  statusDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  statusLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  footer: { paddingHorizontal: 24, gap: 10 },
});
