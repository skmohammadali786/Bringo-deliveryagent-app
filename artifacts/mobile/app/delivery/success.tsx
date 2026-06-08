import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function DeliverySuccessScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, activeOrderId } = useOrderStore();
  const order = orders.find((o) => o.id === activeOrderId) ?? orders[2];
  const scale = useSharedValue(0);

  useEffect(() => { scale.value = withSpring(1, { damping: 10, stiffness: 150 }); }, []);
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.successLight, colors.background]} style={styles.gradient} />
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 80) }]}>
        <Animated.View style={[styles.iconWrap, { backgroundColor: colors.success }, iconStyle]}>
          <Feather name="check" size={56} color="#FFF" />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={{ alignItems: "center", gap: 10 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>Delivery Complete!</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Order delivered successfully. Keep up the great work!
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={[styles.earningsCard, { backgroundColor: colors.successLight, borderRadius: colors.radius }]}>
          <MaterialCommunityIcons name="currency-inr" size={24} color={colors.success} />
          <View>
            <Text style={[styles.earningsLabel, { color: colors.success }]}>Earned this delivery</Text>
            <Text style={[styles.earningsVal, { color: colors.success }]}>₹{order?.deliveryFee ?? 50}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.stats}>
          {[
            { label: "Rating", value: "5.0 ⭐", color: colors.accent },
            { label: "Distance", value: order?.distance ?? "2.3 km", color: colors.primary },
            { label: "Time", value: order?.estimatedTime ?? "25 min", color: colors.foreground },
          ].map((s) => (
            <View key={s.label} style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(600).duration(500)} style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}>
        <Button title="Back to Home" onPress={() => router.replace("/(tabs)/")} size="xl" variant="success" />
        <Button title="View Order Details" onPress={() => router.push(`/order/${order?.id}` as any)} variant="ghost" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { position: "absolute", top: 0, left: 0, right: 0, height: 280 },
  content: { flex: 1, paddingHorizontal: 24, alignItems: "center", gap: 28 },
  iconWrap: { width: 120, height: 120, borderRadius: 60, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1, textAlign: "center" },
  sub: { fontSize: 16, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 26 },
  earningsCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 20, width: "100%" },
  earningsLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  earningsVal: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  stats: { flexDirection: "row", gap: 10, width: "100%" },
  stat: { flex: 1, alignItems: "center", padding: 14, gap: 4, borderWidth: 1 },
  statVal: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 24, gap: 8 },
});
