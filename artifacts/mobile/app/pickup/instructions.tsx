import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

const STEPS = [
  { icon: "shopping-bag", title: "Collect all items", desc: "Verify each item against the order list" },
  { icon: "camera", title: "Take pickup photo", desc: "Photo of all items together with receipt" },
  { icon: "hash", title: "Enter OTP", desc: "Get pickup OTP from shop owner" },
  { icon: "check-circle", title: "Confirm pickup", desc: "Mark order as picked up" },
];

export default function PickupInstructionsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, activeOrderId } = useOrderStore();
  const order = orders.find((o) => o.id === activeOrderId) ?? orders[1];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Pickup Instructions" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {/* Pickup OTP */}
        {order?.pickupOtp && (
          <Animated.View entering={FadeInDown.delay(50).duration(400)}>
            <Card style={[styles.otpCard, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.otpLabel, { color: colors.primary }]}>SHOP PICKUP OTP</Text>
              <Text style={[styles.otpValue, { color: colors.primary }]}>{order.pickupOtp}</Text>
              <Text style={[styles.otpHint, { color: colors.primary }]}>Show this to the shop owner</Text>
            </Card>
          </Animated.View>
        )}

        {/* Steps */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Pickup Steps</Text>
          {STEPS.map((step, i) => (
            <View key={step.title} style={[styles.step, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
              <View style={[styles.stepNum, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.stepNumText, { color: colors.primary }]}>{i + 1}</Text>
              </View>
              <View style={[styles.stepIcon, { backgroundColor: colors.muted }]}>
                <Feather name={step.icon as any} size={18} color={colors.foreground} />
              </View>
              <View style={styles.stepText}>
                <Text style={[styles.stepTitle, { color: colors.foreground }]}>{step.title}</Text>
                <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Order Summary */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card>
            <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>ITEMS TO COLLECT</Text>
            {order?.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Feather name="package" size={14} color={colors.primary} />
                <Text style={[styles.itemText, { color: colors.foreground }]}>{item.quantity}x {item.name}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button title="Proceed to Confirm Pickup" onPress={() => router.push("/pickup/confirm" as any)} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  otpCard: { alignItems: "center", gap: 4, padding: 20 },
  otpLabel: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  otpValue: { fontSize: 42, fontFamily: "Inter_700Bold", letterSpacing: 8 },
  otpHint: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 8 },
  step: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderWidth: 1, marginBottom: 8 },
  stepNum: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  stepNumText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  stepIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  stepText: { flex: 1, gap: 2 },
  stepTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  stepDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  cardTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, marginBottom: 10 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  itemText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});
