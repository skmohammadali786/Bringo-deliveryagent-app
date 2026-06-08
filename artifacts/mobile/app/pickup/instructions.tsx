import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";
import { fadeInDown, fadeInDownDelay, fadeInDownIndexed } from "@/constants/animations";

const STEPS = [
  {
    step: 1,
    title: "Package the items",
    desc: "Ensure all items are securely packed. Check for fragile or liquid items that need extra care.",
    icon: "package" as const,
    color: "#FF6B35",
  },
  {
    step: 2,
    title: "Verify the order",
    desc: "Cross-check items against the order list. Make sure quantities match before leaving.",
    icon: "check-square" as const,
    color: "#34C759",
  },
  {
    step: 3,
    title: "Navigate to customer",
    desc: "Use Google Maps for optimal route. Follow traffic rules and ride safely.",
    icon: "navigation" as const,
    color: "#4A90E2",
  },
  {
    step: 4,
    title: "Deliver & verify OTP",
    desc: "Hand over items, collect OTP from customer to confirm successful delivery.",
    icon: "shield" as const,
    color: "#7C5CFF",
  },
];

export default function PickupInstructionsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders } = useOrderStore();

  const activeOrder = orders.find((o) =>
    ["picked_up", "at_shop", "accepted"].includes(o.status)
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Pickup Instructions" showBack />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Banner */}
        <Animated.View entering={fadeInDown(0)}>
          <Card style={[styles.heroBanner, { backgroundColor: colors.primaryLight, borderColor: colors.primary + "30" }]}>
            <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}>
              <Feather name="package" size={28} color="#FFF" />
            </View>
            <View style={styles.heroText}>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>Ready to Pick Up!</Text>
              <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
                Follow these steps for a smooth delivery
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Steps */}
        {STEPS.map((step, i) => (
          <Animated.View key={step.step} entering={fadeInDownIndexed(60, i)}>
            <View style={styles.stepRow}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepCircle, { backgroundColor: step.color }]}>
                  <Text style={styles.stepNum}>{step.step}</Text>
                </View>
                {i < STEPS.length - 1 && (
                  <View style={[styles.stepConnector, { backgroundColor: colors.border }]} />
                )}
              </View>
              <Card style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <View style={[styles.stepIcon, { backgroundColor: step.color + "18" }]}>
                    <Feather name={step.icon} size={18} color={step.color} />
                  </View>
                  <Text style={[styles.stepTitle, { color: colors.foreground }]}>{step.title}</Text>
                </View>
                <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>{step.desc}</Text>
              </Card>
            </View>
          </Animated.View>
        ))}

        {/* Safety Tips */}
        <Animated.View entering={fadeInDownDelay(400)}>
          <Card style={[styles.safetyCard, { backgroundColor: colors.warningLight, borderColor: colors.warning + "30" }]}>
            <Feather name="shield" size={18} color={colors.warning} />
            <View style={styles.safetyText}>
              <Text style={[styles.safetyTitle, { color: colors.foreground }]}>Safety First</Text>
              <Text style={[styles.safetySub, { color: colors.mutedForeground }]}>
                Wear your helmet, follow traffic rules, and take safe routes. Your safety matters most.
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Order Details */}
        {activeOrder && (
          <Animated.View entering={fadeInDownDelay(480)}>
            <Card style={styles.orderCard}>
              <Text style={[styles.orderLabel, { color: colors.mutedForeground }]}>ACTIVE ORDER</Text>
              <Text style={[styles.orderNum, { color: colors.foreground }]}>{activeOrder.orderNumber}</Text>
              <Text style={[styles.orderCustomer, { color: colors.mutedForeground }]}>
                {activeOrder.customer.name} · {activeOrder.distance}
              </Text>
            </Card>
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button
          title="Start Delivery Navigation"
          onPress={() => router.push("/delivery/navigate" as any)}
          size="xl"
          icon={<Feather name="navigation" size={18} color="#FFF" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  heroBanner: { flexDirection: "row", alignItems: "center", gap: 16, borderWidth: 1 },
  heroIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  heroText: { flex: 1, gap: 3 },
  heroTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  stepRow: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  stepLeft: { alignItems: "center", width: 36 },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFF" },
  stepConnector: { width: 2, height: 20, marginTop: 6 },
  stepCard: { flex: 1, gap: 10, marginBottom: 4 },
  stepHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  stepTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  stepDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  safetyCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderWidth: 1 },
  safetyText: { flex: 1, gap: 4 },
  safetyTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  safetySub: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  orderCard: { gap: 4 },
  orderLabel: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  orderNum: { fontSize: 16, fontFamily: "Inter_700Bold" },
  orderCustomer: { fontSize: 13, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});
